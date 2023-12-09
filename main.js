const myForm = document.querySelector('#my-form');
const expense = document.querySelector('#expense');
const exp_desc = document.querySelector('#exp_desc');
const exp_type = document.querySelector('#exp_type');
const msg_exp = document.querySelector('#msg_exp');
const msg_exp_type = document.querySelector('#msg_exp_type');
const msg_desc = document.querySelector('#msg_desc');
const tblExpense = document.getElementById('tblExpense');
var expArr = [];

myForm.addEventListener('submit', onSubmit);

// records.addEventListener('click', remExp);
// records.addEventListener('click', editExp);

// Get Existing data from the database and populate the table with that data

window.addEventListener('DOMContentLoaded', async () => {
    let response = await axios.get('http://localhost:4000/expense/get-expenses');
    // console.log(response.data.allExpDetails);
    let data = response.data.allExpDetails;

    data.forEach(d => {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');        
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        

        td1.appendChild(document.createTextNode(`${d.id}`));
        td1.className = 'd-none';
        td2.appendChild(document.createTextNode(`${d.amount}`));
        td3.appendChild(document.createTextNode(`${d.description}`));
        td4.appendChild(document.createTextNode(`${d.expType}`));

        let del = document.createElement('button');
        del.className = 'btn btn-danger btn-sm float-right delete';
        del.appendChild(document.createTextNode('X'));
        del.addEventListener('click', function(){ deleteExp(td1); });

        let edit = document.createElement('button');
        edit.className = 'btn btn-info btn-sm float-right edit';
        edit.appendChild(document.createTextNode('Edit'));

        td5.appendChild(del);
        td5.appendChild(edit);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tblExpense.appendChild(tr);

        expObj = {
            expense: d.amount,
            exp_desc: d.description,
            exp_type: d.expType,
            id: d.id
        };
        expArr.push(expObj);
    });
    // console.log(expObj);

})

// Validating and adding Record to the List and in the Local Storage

async function onSubmit(e) {
    e.preventDefault();

    if(expense.value === ''){
        msg_exp.style.color = 'chocolate';
        msg_exp.style.background = 'beige';  
        msg_exp.innerHTML = 'Please Enter Expense Amount!';
        setTimeout(() => msg_exp.remove(), 3000);
    } else if (exp_desc.value === '') {
        msg_desc.style.color = 'chocolate';
        msg_desc.style.background = 'beige';  
        msg_desc.innerHTML = 'Please Enter Something about Your Expense!';
        setTimeout(() => msg_desc.remove(), 3000);
    } else if (exp_type.value === 'none') {
        msg_exp_type.style.color = 'chocolate';
        msg_exp_type.style.background = 'beige';  
        msg_exp_type.innerHTML = 'Please Select Expense Type!';
        setTimeout(() => msg_exp_type.remove(), 3000);
    } else {
        let expObj = {
            expense: expense.value,
            exp_desc: exp_desc.value,
            exp_type: exp_type.value
        }
        // console.log(expObj);


        let res = await axios.post('http://localhost:4000/expense/add-expense', expObj);

        // console.log(res.data.newExpDetail);

        let data = res. data.newExpDetail;

        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');        
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        

        td1.appendChild(document.createTextNode(`${data.id}`));
        td1.className = 'd-none';
        td2.appendChild(document.createTextNode(`${data.amount}`));
        td3.appendChild(document.createTextNode(`${data.description}`));
        td4.appendChild(document.createTextNode(`${data.expType}`));

        let del = document.createElement('button');
        del.className = 'btn btn-danger btn-sm float-right delete';
        del.appendChild(document.createTextNode('X'));
        del.addEventListener('click', function(){ deleteExp(td1); });

        let edit = document.createElement('button');
        edit.className = 'btn btn-info btn-sm float-right edit';
        edit.appendChild(document.createTextNode('Edit'));

        td5.appendChild(del);
        td5.appendChild(edit);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tblExpense.appendChild(tr);

        expObj = {
            expense: data.amount,
            exp_desc: data.description,
            exp_type: data.expType,
            id: data.id
        };


        expArr.push(expObj);
        expense.value = '';
        exp_desc.value = '';
        exp_type.value = '';
        // console.log(expObj);
    }

}

//Deleting the Expense Data from UL as well as Local Storage after Confirmation from the User

async function deleteExp(e) {
    // console.log(e);
    let tr = e.parentElement;
    let tbl = tr.parentElement;
    let expense = expArr.find(u => u.id == e.innerHTML);
    // console.log(expense);

    let res = await axios.post(`http://localhost:4000/expense/delete-expense/${expense.id}`);
    console.log(res);
    tbl.removeChild(tr);
}


//Editing Expense Information after Registration

function editExp(e) {
    if (e.target.classList.contains('edit')) {
        var li = e.target.parentElement;
        for (var i = 0; i < expArr.length; i++) {
            if (li.firstChild.textContent.indexOf(expArr[i]) != -1) {
                exp_deserial = JSON.parse(localStorage.getItem(expArr[i]));
                expense.value = exp_deserial.expense;
                exp_desc.value = exp_deserial.exp_desc;
                exp_type.value = exp_deserial.exp_type;
                localStorage.removeItem(expArr[i]);
            }
        }
        records.removeChild(li);
    }
}
