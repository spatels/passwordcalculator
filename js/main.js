//hide divider    
function getBrowserSize(){
       var w, h;

         if(typeof window.innerWidth != 'undefined')
         {
          w = window.innerWidth; //other browsers
          h = window.innerHeight;
         } 
         else if(typeof document.documentElement != 'undefined' && typeof      document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) 
         {
          w =  document.documentElement.clientWidth; //IE
          h = document.documentElement.clientHeight;
         }
         else{
          w = document.body.clientWidth; //IE
          h = document.body.clientHeight;
         }
       return {'width':w, 'height': h};
}

if(parseInt(getBrowserSize().width) < 765){
 document.getElementById("divider").style.display = "none";
}

// toggle
$(document).ready(function () {
 
    $('.ui.slider')
    .checkbox()
  ;
  
  });

// toast 

// function to validate form
function validateForm() {
  textValidationPass = 0
  textBoxArray = ["site","user","master_password"]
  textBoxArray.forEach(element => {
    let name = document.forms["form"][element].name;
    let value = document.forms["form"][element].value;
    if (value == "") {
      $.toast({
        class: 'error',
        displayTime: 0,
        showIcon: 'exclamation triangle',
        closeIcon: true,
        message: `${name} must be filled out.`
      })

    }
    else{
      textValidationPass = 1 
    }
  });
  checkBoxValidationPass = 0
  checkBoxArray = ["lowercase","uppercase","numbers","symbols"]
  valueArray = []
  checkBoxArray.forEach(element => {
    valueArray.push(document.forms["form"][element].checked)
  })
  if (valueArray.every( (val, i, arr) => val === arr[0] && val === false)){
    $.toast({
      class: 'error',
      displayTime: 0,
      showIcon: 'exclamation triangle',
      closeIcon: true,
      message: "Atleast one character option needs to selected."
    })
  }
  else{
    checkBoxValidationPass = 1
  }

      // validation was successful
      validationPass = 1
      return true;
} 

function submitForm(){
  let user_input = Array.from(document.querySelectorAll('#form input')).reduce(
    (acc,
    input)=>(input.type==='checkbox'?({...acc,[input.id]:input.checked}):({...acc,[input.id]:input.value}))
    ,{}
    )

  let payload = {
    "site_profile":{
       "site":user_input.site,
       "user":user_input.user,
       "lowercase":user_input.lowercase,
       "uppercase":user_input.uppercase,
       "numbers":user_input.numbers,
       "symbols":user_input.symbols,
       "length":16
    },
    "master_password":user_input.master_password
 }

fetch('https://passwordcalculator.pythonanywhere.com/generate', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
})
   .then(response => response.json())
   .then(response => document.getElementById("site_password").innerHTML = `<input readonly="" id="calculated_password" type="password" value=${response.password}>
   <div class="ui icon buttons">
   <button id="1" class="ui button" onclick=showhide() ><i class="eye icon" ></i></button>
   <button class="ui button" onclick=copy()><i class="copy icon"></i></button>
 </div>`)
   .then(response => document.getElementById("message").innerHTML = `Your Password for ${payload["site_profile"]["site"]}`)
   .then(response =>document.getElementById("form").reset())

}

// submit form

addEventListener("submit", (e) => {
  e.preventDefault();
  validateForm()
  if (textValidationPass === 1 && checkBoxValidationPass ===1) {
    submitForm()
  } 



});

function showhide() {
  var x = document.getElementById("calculated_password");
  var y = document.getElementById("1");
  if (x.type === "password") {
    x.type = "text";
    y.innerHTML  = `<i class="eye slash icon" ></i>`
  } else {
    x.type = "password";
    y.innerHTML  = `<i class="eye icon" ></i>`
  }
} 
    
function copy() {
  // Get the text field
  var copyText = document.getElementById("calculated_password");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
     $.toast({
      class: 'info',
      displayTime: 1000,
      showIcon: 'copy',
      message: "Password copied"
    })
} 

