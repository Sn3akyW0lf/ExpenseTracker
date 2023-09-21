const myForm = document.querySelector('#my-form');
const expense = document.querySelector('#expense');
const exp_desc = document.querySelector('#exp_desc');
const exp_type = document.querySelector('#exp_type');
const msg_exp = document.querySelector('#msg_exp');
const msg_exp_type = document.querySelector('#msg_exp_type');
const msg_desc = document.querySelector('#msg_desc');
var records = document.getElementById('records');
var expArr = [];

myForm.addEventListener('submit', onSubmit);

records.addEventListener('click', remExp);
records.addEventListener('click', editExp);

// Validating and adding Record to the List and in the Local Storage

function onSubmit(e) {
    e.preventDefault();

    if(expense.value === ''){
        msg_exp.style.color = 'chocolate';
        msg_exp.style.background = 'beige';  
        msg_exp.innerHTML = 'PLease Enter Expense Amount!';
        setTimeout(() => msg_exp.remove(), 3000);
    } else if (exp_desc.value === '') {
        msg_desc.style.color = 'chocolate';
        msg_desc.style.background = 'beige';  
        msg_desc.innerHTML = 'PLease Enter Something about Your Expense!';
        setTimeout(() => msg_desc.remove(), 3000);
    } else if (exp_type.value === 'none') {
        msg_exp_type.style.color = 'chocolate';
        msg_exp_type.style.background = 'beige';  
        msg_exp_type.innerHTML = 'PLease Select Expense Type!';
        setTimeout(() => msg_exp_type.remove(), 3000);
    } else {
        var expObj = {
            expense: expense.value,
            exp_desc: exp_desc.value,
            exp_type: exp_type.value
        };

        var expObj_serial = JSON.stringify(expObj);
        localStorage.setItem(exp_type.value, expObj_serial);

        var li = document.createElement('li');
        li.className = 'list-group-item';

        li.appendChild(document.createTextNode(`Amount - ${expObj.expense}, Where - ${expObj.exp_desc}, Expense Type - ${expObj.exp_type}`));

        var del = document.createElement('button');
        var edit = document.createElement('button');
        del.className = 'btn btn-danger btn-sm float-right delete';
        edit.className = 'btn btn-info btn-sm float-right edit';

        del.appendChild(document.createTextNode('X'));
        edit.appendChild(document.createTextNode('Edit'));

        li.appendChild(del);
        li.appendChild(edit);
        records.appendChild(li);
        expArr.push(expObj.exp_type);
        expense.value = '';
        exp_desc.value = '';
        exp_type.value = '';
    }

}

//Deleting the Expense Data from UL as well as Local Storage after Confirmation from the User

function remExp(e) {
    if (e.target.classList.contains('delete')) {
        if (confirm('Do You Want to Delete This Record?')) {
            var li = e.target.parentElement;
            for (var i = 0; i < expArr.length; i++) {
                if (li.firstChild.textContent.indexOf(expArr[i]) != -1) {
                    localStorage.removeItem(expArr[i]);
                }
            }
            records.removeChild(li);
        }
    }
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
