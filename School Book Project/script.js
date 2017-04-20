CB.CloudApp.init('nhezpeuprhiw','0e1f84d2-970b-4e1e-bd66-729aee0a53a4');
let user = new CB.CloudUser();
function signUp(form){
  user.set('username',form.username.value);
  user.set('password',form.password.value);
  user.set('email',form.email.value);
  user.set('telephone',form.telephone.value);
  user.set('homepage',form.homepage.value);
  user.signUp({
    success: function(new_user){
      alert("Signed up");
    },
    error: function(error){
      console.log(error.response.data.error);
    }
  });
};
function login(form){
  user.set('username',form.username.value);
  user.set('password',form.password.value);
  user.logIn({
    success: function(new_user){
      alert("logged in");
    },
    error: function(error){
      console.log(error.response.data.error);
    }
  });
};
function logOut(){
  CB.CloudUser.current.logOut({
    success: function(new_user){

    },
    error: function(error){
      console.log(error.response.data.error)
    }
  });
};
