/* ==========================================================================
   GLOBAL THEME TOGGLE & PERSISTENCE
   ========================================================================== */
const themeToggleBtn = document.getElementById('themeToggleBtn');
const bodyElement = document.body;

const currentTheme = localStorage.getItem('theme') || 'light-theme';
bodyElement.className = currentTheme;
themeToggleBtn.textContent = currentTheme === 'dark-theme' ? '☀️ Light Mode' : '🌙 Dark Mode';

themeToggleBtn.addEventListener('click', () => {
    if (bodyElement.classList.contains('light-theme')) {
        bodyElement.className = 'dark-theme';
        localStorage.setItem('theme', 'dark-theme');
        themeToggleBtn.textContent = '☀️ Light Mode';
    } else {
        bodyElement.className = 'light-theme';
        localStorage.setItem('theme', 'light-theme');
        themeToggleBtn.textContent = '🌙 Dark Mode';
    }
});


/* ==========================================================================
   ASSIGNMENT 3: Student Result Management System with Admin Search & CSV Export
   ========================================================================== */
const studentForm = document.getElementById('studentForm');
const studentTableBody = document.querySelector('#studentTable tbody');
const topperName = document.getElementById('topperName');
const topperPercent = document.getElementById('topperPercent');
const studentSearchInput = document.getElementById('studentSearchInput');
const exportStudentsBtn = document.getElementById('exportStudentsBtn');

let students = JSON.parse(localStorage.getItem('students')) || [];

function renderStudents(filterText = '') {
    studentTableBody.innerHTML = '';
    let highestPercent = -1;
    let topper = 'None';

    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(filterText.toLowerCase()) || 
        student.roll.toLowerCase().includes(filterText.toLowerCase())
    );

    filteredStudents.forEach((student) => {
        const originalIndex = students.indexOf(student);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td><strong>${student.roll}</strong></td>
            <td>${student.m1}</td>
            <td>${student.m2}</td>
            <td>${student.m3}</td>
            <td>${student.total}</td>
            <td>${student.percentage}%</td>
            <td><button class="btn-delete" onclick="deleteStudent(${originalIndex})">Delete</button></td>
        `;
        studentTableBody.appendChild(row);
    });

    students.forEach(student => {
        if (student.percentage > highestPercent) {
            highestPercent = student.percentage;
            topper = student.name;
        }
    });

    topperName.textContent = topper;
    topperPercent.textContent = highestPercent >= 0 ? highestPercent : 0;
}

studentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const m1 = Number(document.getElementById('marks1').value);
    const m2 = Number(document.getElementById('marks2').value);
    const m3 = Number(document.getElementById('marks3').value);
    const total = m1 + m2 + m3;
    const percentage = Number(((total / 300) * 100).toFixed(2));

    const student = {
        name: document.getElementById('studentName').value,
        roll: document.getElementById('studentRoll').value,
        m1, m2, m3, total, percentage
    };

    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents(studentSearchInput.value);
    studentForm.reset();
});

studentSearchInput.addEventListener('input', (e) => {
    renderStudents(e.target.value);
});

function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents(studentSearchInput.value);
}

exportStudentsBtn.addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,Student Name,Roll No,Subject 1,Subject 2,Subject 3,Total Score,Percentage\n";
    students.forEach(s => {
        csvContent += `"${s.name}","${s.roll}",${s.m1},${s.m2},${s.m3},${s.total},${s.percentage}%\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'student_results_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});


/* ==========================================================================
   ASSIGNMENT 4: Employee Registration Portal with Admin ID Lookup & Cards
   ========================================================================== */
const employeeForm = document.getElementById('employeeForm');
const employeeList = document.getElementById('employeeList');
const employeeSearchInput = document.getElementById('employeeSearchInput');
const exportEmployeesBtn = document.getElementById('exportEmployeesBtn');

let employees = JSON.parse(localStorage.getItem('employees')) || [];

function renderEmployees(filterText = '') {
    employeeList.innerHTML = '';

    const filteredEmployees = employees.filter(emp => 
        emp.empId.toLowerCase().includes(filterText.toLowerCase()) || 
        emp.name.toLowerCase().includes(filterText.toLowerCase()) ||
        emp.dept.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filteredEmployees.length === 0) {
        employeeList.innerHTML = '<p class="no-records">No personnel records found matching search criteria.</p>';
        return;
    }

    filteredEmployees.forEach((emp) => {
        const originalIndex = employees.indexOf(emp);
        const div = document.createElement('div');
        div.className = 'employee-card';
        div.innerHTML = `
            <div>
                <strong>ID: [${emp.empId}] - ${emp.name}</strong><br>
                <span>Email: ${emp.email} | Phone: ${emp.phone} | Dept: <strong>${emp.dept}</strong></span>
            </div>
            <button class="btn-delete" onclick="deleteEmployee(${originalIndex})">Delete</button>
        `;
        employeeList.appendChild(div);
    });
}

employeeForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const phone = document.getElementById('empPhone').value;
    if (!/^\d{10}$/.test(phone)) {
        alert('Validation Error: Phone number must contain exactly 10 numeric digits.');
        return;
    }

    const employee = {
        empId: document.getElementById('empId').value.trim(),
        name: document.getElementById('empName').value.trim(),
        email: document.getElementById('empEmail').value.trim(),
        password: document.getElementById('empPassword').value,
        phone: phone,
        dept: document.getElementById('empDept').value
    };

    employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees(employeeSearchInput.value);
    employeeForm.reset();
    alert('Personnel Registered Successfully!');
});

employeeSearchInput.addEventListener('input', (e) => {
    renderEmployees(e.target.value);
});

function deleteEmployee(index) {
    employees.splice(index, 1);
    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees(employeeSearchInput.value);
}

exportEmployeesBtn.addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,Employee ID,Full Name,Email,Phone,Department\n";
    employees.forEach(e => {
        csvContent += `"${e.empId}","${e.name}","${e.email}","${e.phone}","${e.dept}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'employee_directory_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});


/* ==========================================================================
   ADVANCED EXPENSE TRACKER: Personal/Institutional, Timeframe Filtering & Analytics
   ========================================================================== */
const expenseForm = document.getElementById('expenseForm');
const expenseTableBody = document.querySelector('#expenseTable tbody');
const totalExpenseDisplay = document.getElementById('totalExpense');
const personalTotalDisplay = document.getElementById('personalTotal');
const institutionalTotalDisplay = document.getElementById('institutionalTotal');
const timeframeFilter = document.getElementById('timeframeFilter');
const scopeFilter = document.getElementById('scopeFilter');
const exportExpensesBtn = document.getElementById('exportExpensesBtn');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function renderExpenses() {
    expenseTableBody.innerHTML = '';
    let totalAmount = 0;
    let personalSum = 0;
    let institutionalSum = 0;

    const selectedTimeframe = timeframeFilter.value;
    const selectedScope = scopeFilter.value;
    const today = new Date();

    const filteredExpenses = expenses.filter(item => {
        const itemDate = new Date(item.date);
        
        if (selectedScope !== 'ALL' && item.scope !== selectedScope) {
            return false;
        }

        if (selectedTimeframe === 'DAILY') {
            return itemDate.toDateString() === today.toDateString();
        } else if (selectedTimeframe === 'WEEKLY') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            return itemDate >= oneWeekAgo && itemDate <= today;
        } else if (selectedTimeframe === 'MONTHLY') {
            return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
        } else if (selectedTimeframe === 'YEARLY') {
            return itemDate.getFullYear() === today.getFullYear();
        }
        
        return true;
    });

    filteredExpenses.forEach((item) => {
        const originalIndex = expenses.indexOf(item);
        totalAmount += item.amount;

        if (item.scope === 'Personal') {
            personalSum += item.amount;
        } else if (item.scope === 'Institutional') {
            institutionalSum += item.amount;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.title}</td>
            <td><span class="badge-scope ${item.scope ? item.scope.toLowerCase() : 'personal'}">${item.scope || 'Personal'}</span></td>
            <td>${item.category}</td>
            <td>${item.method}</td>
            <td>₹${item.amount.toLocaleString('en-IN')}</td>
            <td><button class="btn-delete" onclick="deleteExpense(${originalIndex})">Delete</button></td>
        `;
        expenseTableBody.appendChild(row);
    });

    totalExpenseDisplay.textContent = totalAmount.toLocaleString('en-IN');
    personalTotalDisplay.textContent = personalSum.toLocaleString('en-IN');
    institutionalTotalDisplay.textContent = institutionalSum.toLocaleString('en-IN');
}

expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const expense = {
        title: document.getElementById('expTitle').value,
        amount: Number(document.getElementById('expAmount').value),
        date: document.getElementById('expDate').value,
        scope: document.getElementById('expScope').value,
        category: document.getElementById('expCategory').value,
        method: document.getElementById('expMethod').value
    };

    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    timeframeFilter.value = 'ALL';
    scopeFilter.value = 'ALL';
    renderExpenses();
    
    expenseForm.reset();
});

timeframeFilter.addEventListener('change', () => renderExpenses());
scopeFilter.addEventListener('change', () => renderExpenses());

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}

exportExpensesBtn.addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,Description,Scope,Category,Payment Mode,Amount (INR)\n";
    expenses.forEach(ex => {
        csvContent += `"${ex.date}","${ex.title}","${ex.scope || 'Personal'}","${ex.category}","${ex.method}",${ex.amount}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'comprehensive_expense_audit.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Initial Global Rendering
renderStudents();
renderEmployees();
renderExpenses();