const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const Employee = require("./models/employee")

/**
 * Database connection
 */
mongoose.connect("mongodb://127.0.0.1:27017/employee-community")
.then(() => console.log("Db connection successfully done"))
.catch((err) => console.log("Db error occured", err))

const init = async () => {
    /**
     * Configure Hapi server with port and host
     */
    const server = Hapi.server({
        port: 3000,
        host: "127.0.0.1"
    })

    await server.register(require('@hapi/vision'))

    /**
     * View layout
     */
    server.views({
        engines: {
            html: Handlebars
        },
        path: __dirname + '/views',
        layoutPath: 'views/layout',
        layout: 'layout',
        partialsPath: 'views/partials'
    })

    /**
    * Employee page route
    */
    server.route({
        method: "GET",
        path: "/employee",
        handler: async function (request, h) {
            const employeeList = await Employee.find();
            return h.view('employee/index', {
                title: "Employee List",
                employeeList: employeeList.map(item => ({ _id: item._id, id: item.id, name: item.name, city: item.city}))
            })
        }
    })

    /**
    * Create Employee page route
    */
     server.route({
        method: "GET",
        path: "/employee/create",
        handler: async function (request, h) {
            return h.view('employee/create', {
                title: "Create Employee"
            })
        }
    })

    /**
    * Edit Employee page route
    */
     server.route({
        method: "GET",
        path: "/employee/edit/{id}",
        handler: async function (request, h) {
            const id = Number(request?.params?.id)
            const employee = await Employee.findOne({id})
            return h.view('employee/edit', {
                title: "Edit Employee",
                employee: {id: employee?.id, name: employee?.name, city: employee?.city}
            })
        }
    })

    /**
    * Employee Details page route
    */
    server.route({
        method: "GET",
        path: "/employee/view/{id}",
        handler: async function (request, h) {
            const id = Number(request?.params?.id)
            const employee = await Employee.findOne({id})
            return h.view('employee/view', {
                title: "View Employee Details",
                employee: {id: employee?.id, name: employee?.name, city: employee?.city}
            })
        }
    })

    /**
    * Delete Pre-employee View page route
    */
     server.route({
        method: "GET",
        path: "/employee/delete/{id}",
        handler: async function (request, h) {
            const id = Number(request?.params?.id)
            const employee = await Employee.findOne({id})
            return h.view('employee/delete', {
                title: "Employee Details",
                empId: employee?.id,
                employee: {id: employee?.id, name: employee?.name, city: employee?.city}
            })
        }
    })

    /**
    * Confirm delete employee details
    */
    server.route({
        method: "GET",
         path: "/employee/delete-confirm/{id}",
         handler: async function (request, h) {
        const id = Number(request?.params?.id)
        const employee = await Employee.findOneAndDelete({id}, {new: true})
        return h.view('employee/delete-confirm', {
            title: `Employee(ID: ${id}) deleted successfully`,
        });
        }
    })
    
    /**
    * Home/Index page route
    */
    server.route({
        method: "GET",
        path: "/",
        handler: function (request, h) {
            return h.view('index', {
                title: "Welcome to Home Page",
                label: "View Employee",
            })
        }
    })

    /**
    * API --> Create/Update Employee POST Request
    */
      server.route({
        method: "POST",
        path: "/employee",
        handler: async function (request, h) {
           const {id, ...rest} = request.payload || {};
           const { _method } = request.query || {};
           try {
            if(_method === 'PATCH') {
                const emp = await Employee.findOneAndUpdate({ id: Number(id) }, {...rest, id: Number(id) }, {new: true})
            } else {
                const emp = new Employee({
                    ...rest,
                    id: Number(id) 
                })
                emp.save();
            }
           
            return h.view('index', {
                title: "Welcome to Home Page",
                label: "View Employee",
            });
           } catch(error) {
                console.log("Employee POST request error:->", error)
           }
        }
    })

    /**
     * Start Hapi server
     */
    server.start();
    console.log("Server running on:", server.info.uri)
}


/**
 * Handle unhandledRejection.
 */
process.on("unhandledRejection", (error) => {
    console.log("unhandledRejection", error);
    process.exit(1)
});

init();