
function renderHtml(data,upid) {
 
  let defImg = "https://cdn-icons-png.flaticon.com/128/3135/3135715.png";
  let str =`<div class="custom_card col-lg-4 my-3" id="card_${data.id}" >
               <div class = "card">
                <div class="card-header text-center">
                    <h5 class="" id="user">👤 User - ${data.id || upid}   
                    </h5>
                </div>
                <div class="card-body">
                  <h5 class="card-title">  
                  </h5>    
                  <div class="text-center"><img src="${data.avatar?data.avatar:defImg}" class="img-fluid rounded p-1"></div>       
            `;
            
            for (const property in data) 
            {   
                if(property == "avatar")
                {
                  continue;
                }
                else if(property == "createdAt" )
                {
                  continue;
                }
                str +=`<strong class="text-uppercase "> ${property}:</strong> <span class="value">${data[property]}</span><br>`;
                
            } 
  str+=`<strong class="text-uppercase">Full name:</strong> <span>${data.first_name+" "+data.last_name}</span><br>
        </div>
        <div class="card-footer text-center ">
         <button id="delete_${data.id}" data-id=${data.id} class="btn btn-danger">Delete</button>
         <button id="edit_${data.id}" data-id=${data.id} class="btn btn-info" data-toggle="modal" data-target="#myModal" >Edit</button>
        </div>
        </div>
        </div>`;
  return str;
}




function validate(){
   if($('#email').val() == "")
    {
      $('#email').after("<p>this is required</p>");
    }
    else if(($('#first_name').val() == ""))
    {
      $('#first_name').after("<p>this is required</p>");
    }
    else if(($('#last_name').val() == ""))
    {
      $('#last_name').after("<p>this is required</p>");
    }
    else{
      return true;
    }
   return false;
}

$('#myform ').on('submit',function( event ) {
  event.preventDefault();
    if(validate() == true )
    { 
     $("#myModal .close").click();
     let obj = $(this).serialize();
     create(obj);
     $("#reset").trigger("click");
    }
 
});

$(document).on("click", "button[id^=delete_]", function () { 
   
    let id = $(this).attr("data-id");
    deleted(id);
})

$(document).on("click", "button[id^=edit_]", function () { 
  let id = $(this).attr("data-id");
  $.ajax({
    type : "get",
    url  : `https://reqres.in/api/users/`+id,
    // data :,
    // cache:,
    success : function (response) {
        
      for (const property in response) 
        $("#email").val(response.data.email);
        $("#first_name").val(response.data.first_name);
        $("#last_name").val(response.data.last_name);

    },
    error : function(error){
       console.log(error);
    },
  });

  $("#update").click(function (event) {
    event.preventDefault();

    if(validate() == true )
    { 
     $("#myModal .close").click();
     let obj = $(`#myform`).serialize();
     
     update(id,obj);
     $("#reset").trigger("click");
    } 
  //  $("#myform").attr("data-method","update");
  });

});


//* CRUD operation

function create(obj){
   $.ajax({
      type: "post",
      url: "https://reqres.in/api/users",
      data: obj,
    //   cache: false,
      success: function (response) {
        let html="";
        html+=renderHtml(response);
        $("#getData").prepend(html);
      },
      error: function (error) {
        console.log(error);
      },
    });
}
function read (url){
   $.ajax({
      type : "get",
      url  : url,
      // data :,
      // cache:,
      success : function (response) {
        let html =``;

        if(response && response.data && response.data.length>0)
        {
         for(let i = 0;i<response.data.length;i++)
         {
            html+=renderHtml(response.data[i]);
         } 
        }
        $("#getData").html(html);
      },
      error : function(error){
         console.log(error);
      },
   });
}
function update(id,obj){
  
   $.ajax({
        type:'put',
        url:`https://reqres.in/api/users/`+id,
        data:obj,
        success : function (response) {
           console.log(response);
          $(`#card_${id}`).before(renderHtml(response,id));
          $(`#card_${id}`).remove();

        },
        error : function(error){
           console.log(error);
        },
   });
}
function deleted(id){
$.ajax({

   type: "delete",
   url:`https://reqres.in/api/users/+${id}`,
   success:function(){
      $(`#card_${id}`).remove();
   },
});

}

$(document).ready(function(e){
  let url = `https://reqres.in/api/users`;
  read(url); 
  // e.preventDefault();
  
  
   $(document).on("click","#page1",function()
   {   
    url = `https://reqres.in/api/users`;
       read(url);
   }); 
   $(document).on("click","#page2",function()
   {   
      url += `?page=2`;
       read(url);
   }); 


});
