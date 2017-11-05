# CloudBoost
##### By Camilo. Always.
***
### Table of Contents
1. [CloudObject and CloudQuery](#cloudobject-and-cloudquery)
    * [Setting/posting data](#settingposting-data)
    * [Querying/getting data](#queryinggetting-data)
    * [Changing data](#changing-data)
    * [Deleting rows](#deleting-rows)
    * [Methods of querying](#methods-of-querying)
2. [CloudUser](#clouduser)
    * [Sign Up](#sign-up)
    * [Log In](#log-in)
    * [Log Out](#log-out)
    * [Change Password](#change-password)
    * [Reset Password](#reset-password)
3. [CloudGeoPoint](#cloudgeopoint)
    * [Distance in Kilometers](#distance-in-kilometers)
    * [Distance in Miles](#distance-in-miles)
    * [Distance in Radians](#distance-in-radians)

*This markdown file is are simply examples directly corresponding to the `docs.md` file. Full descriptions  of each are in the aforementioned file. **Note:** These are impractical examples and meant only to teach.*

#### CloudObject and CloudQuery
1. #### Setting/posting data
```JavaScript
CB.CloudApp.init('APP-ID','CLIENT-KEY');
var obj = new CB.CloudObject('TableName');
var usernameInput = prompt("Username:");
var passwordInput = prompt("Password:");
obj.set("username",usernameInput);
obj.set("password",passwordInput);
obj.save({
    success: function(obj){
      alert("Success!");
      // obj is the object that
      // was saved to CloudBoost
    },
    error: function(error){
      alert("Error: "+error);
      // error is the problem the
      // server might have encountered
    }
});
```
2. #### Querying/getting data
```JavaScript
CB.CloudApp.init('APP-ID','CLIENT-KEY');
var query = new CB.CloudQuery('TableName');
obj.find({
    success: function(list){
      console.log("All users:",list);
      // list is array of all rows
    },
    error: function(error){
      alert("Error: "+error);
      // error is the problem the
      // server might have encountered
    }
});
```
3. #### Changing data
```JavaScript
CB.CloudApp.init('APP-ID','CLIENT-KEY');
var obj = new CB.CloudObject('TableName');
var query = new CB.CloudQuery('TableName');
var newPassword = prompt("New password:");
query.findById(window.currentUser.id,{
    success: function(list){
      /* see Methods of Querying section
       * for info on .findById */
      list.set('password',newPassword);
      list.save({
        success: function(obj){
          alert("Password changed!");
          // obj is the object that
          // was changed
        },
        error: function(error){
          alert("Error: "+error);
          // error is the problem the
          // server might have encountered
        }
      });
    },
    error: function(error){
      alert("Error: "+error);
      // error is the problem the
      // server might have encountered
    }
});
```
4. #### Deleting rows
```JavaScript
CB.CloudApp.init('APP-ID','CLIENT-KEY');
var obj = new CB.CloudObject('TableName');
query.findById(window.currentUser.id,{
    success: function(list){
      /* see Methods of Querying section
       * for info on .findById */
      list.delete({
        success: function(obj){
          alert("Account deleted!");
          // obj is the object that
          // was deleted
        },
        error: function(error){
          alert("Error: "+error);
          // error is the problem the
          // server might have encountered
        }
      });
    },
    error: function(error){
      alert("Error: "+error);
      // error is the problem the
      // server might have encountered
    }
});
```
    }
  });
  ```
