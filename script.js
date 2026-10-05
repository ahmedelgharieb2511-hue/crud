class Employee {
    constructor(name, position, salary, department ) {
        this.id = Date.now(); // Simple ID generation
        this.name = name;
        this.position = position;
        this.salary = salary;
        this.department = department;
    }
}
class EmployeeManager {
    constructor() {
        this.employees = [];
        this.loadEmployees();
    }
    loadEmployees() {
        try {
            const employeesData = localStorage.getItem('employees');
            if (employeesData) {
                this.employees = JSON.parse(employeesData);
            }
        } catch (error) {
            console.error('Error parsing employees data from localStorage:', error);
            this.employees = [];
        }
    }
    addEmployee(employee) {
        this.employees.push(employee);
        this.saveEmployees();
    }

    saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(this.employees));
    }
     editEmployee(id, updatedEmployee) {
        
        const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) return false;
    this.employees[index] = { ...this.employees[index], ...updatedEmployee };
    this.saveEmployees();
    return true;

    }
    
    deleteEmployee(id) {
        this.employees = this.employees.filter(emp => emp.id !== id);
        this.saveEmployees();
    }
    getAllEmployees() {
        return this.employees;
    }
}
class UI {
    constructor(employeeManager) {
        this.employeeManager = employeeManager;
        this.employeeForm = document.getElementById('employeeForm');
        this.employeeTableBody = document.getElementById('employeeTableBody');
        this.editingEmployeeId = null;
       this.emptymessage = document.querySelector('.no-employees-container');
       this.submitBtn = this.employeeForm.querySelector('button[type="submit"]');
       
       this.employeeForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.renderEmployees();
    }
    
     getformData() {
        return {
            name: document.getElementById('name').value.trim(),
            position: document.getElementById('position').value.trim(),
            salary: document.getElementById('salary').value.trim(),
            department: document.getElementById('department').value.trim()
        };
    }

    

    renderEmployees() {
        this.employeeTableBody.innerHTML = '';
        const employees = this.employeeManager.getAllEmployees();
        if (employees.length === 0) {
            this.emptymessage.style.display = 'block';
        } else {
            this.emptymessage.style.display = 'none';
        }
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.position}</td>
                <td>${employee.salary}</td>
                <td>${employee.department}</td>
                <td>
                    <button onclick="ui.editEmployee(${employee.id})">Edit</button>
                    <button onclick="ui.deleteEmployee(${employee.id})">Delete</button>
                </td>
            `;
            this.employeeTableBody.appendChild(row);
        });
    }
    fillForm(employee) {
        document.getElementById('name').value = employee.name;
        document.getElementById('position').value = employee.position;
        document.getElementById('salary').value = employee.salary;
        document.getElementById('department').value = employee.department;
    }

    editEmployee(id) {
        const employee = this.employeeManager.getAllEmployees().find(emp => emp.id === id);
        if (employee) {
            this.fillForm(employee);
            this.editingEmployeeId = id;
            this.submitBtn.textContent = 'Update Employee';
        }
    }
    
    deleteEmployee(id) {
        if (confirm('Are you sure you want to delete this employee?')) {
            this.employeeManager.deleteEmployee(id);
            this.renderEmployees();
        }
    }

    validateForm(data) {
        const { name, position, salary, department } = data;
        return name && position && salary && department;
    }
    handleFormSubmit(e) {                                              
        e.preventDefault();
        const formData = this.getformData();
        if (!this.validateForm(formData)) {
            alert('Please fill in all fields.');
            return;
        }
      
        if (this.editingEmployeeId) {
            this.employeeManager.editEmployee(this.editingEmployeeId, formData);
            this.resetForm();
            this.renderEmployees();
            this.submitBtn.textContent = 'Add Employee';
        } else {
            const newEmployee = new Employee(formData.name, formData.position, formData.salary, formData.department);
            this.employeeManager.addEmployee(newEmployee);
            this.resetForm();
            this.renderEmployees();
        }
    } 
    resetForm() {
        this.employeeForm.reset();
        this.editingEmployeeId = null;
        this.submitBtn.textContent = 'Add Employee';
    }
    

   createEmployeeRow(employee) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${employee.name}</td>
                         <td>${employee.position}</td>
                         <td>${employee.salary}</td>
                         <td>${employee.department}</td>
                         <td>
                             <button onclick="ui.editEmployee(${employee.id})">Edit</button>
                             <button onclick="ui.deleteEmployee(${employee.id})">Delete</button>
                         </td>`;
        return row;
     }  
   
}

const employeeManager = new EmployeeManager();
const ui = new UI(employeeManager);