# CloudBoost
##### By Camilo. Always.
***
### Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Usage](#usage)
    * [Setup](#setup)
    * [CloudObject and CloudQuery](#cloudobject-and-cloudquery)
        * [Constructor](#constructor)
        * [Setting/posting data](#settingposting-data)
        * [Querying/getting data](#queryinggetting-data)
        * [Changing data](#changing-data)
        * [Deleting rows](#deleting-rows)
        * [Methods of querying](#methods-of-querying)
    * [CloudUser](#clouduser)
        * [Constructor](#constructor-1)
        * [Sign Up](#sign-up)
        * [Log In](#log-in)
        * [Log Out](#log-out)
        * [Change Password](#change-password)
        * [Reset Password](#reset-password)
    * [CloudGeoPoint](#cloudgeopoint)
        * [Constructor](#constructor-3)
        * [Distance in Kilometers](#distance-in-kilometers)
        * [Distance in Miles](#distance-in-miles)
        * [Distance in Radians](#distance-in-radians)

### Description
This is an API called [CloudBoost](https://cloudboost.io) used with JavaScript to post and get data from the cloud storage. It uses HTTP `GET`, `PUT`, and `DELETE` requests.

### Installation
No installation required, unless you are using Node.js. In that case, make sure you are in your app's directory, and run this command in the command line:
```bash
npm install cloudboost --save
```
And initiate with this:
```JavaScript
var CB = require('cloudboost');
```
Everything thereafter is the same.

### Usage
#### Setup
In your HTML file, include this `<script>` tag:
```html
<script src="https://cloudboost.io/js-sdk/cloudboost.min.js"></script>
```
In JavaScript, initiate the CloudApp using this:
```JavaScript
CB.CloudApp.init('APP-ID','CLIENT-KEY');
```
* You'll need to register for an app at the CloudBoost website, where you can find your app ID and Client Key.

#### CloudObject and CloudQuery
*These two CloudBoost variables are the main ones, used to post and get data from custom-created tables.*
* There's quite a bit you must do on the website, such as now creating a new table.
* Once you have the table name, create the variables you will use for posting and querying data.


##### Constructor
```JavaScript
var obj = new CB.CloudObject('TableName');
var query = new CB.CloudQuery('TableName');
```
Notice you use `CloudObject` for posting data, and `CloudQuery` for querying data. You must also replace `'TableName'` with the name of the table you wish to post to or query from. Once we have initiated the variables, you can set, query, change, and delete data.


1. #### Setting/posting data
uses the Ajax/HTTP method `PUT`. When setting data, use this:
```JavaScript
obj.set('columnName','data');
```
Replace `'columnName'` with the name of the column in your table that you wish to add to. Replace `'data'` with the value you want to put in the column. After setting data, you must always call the `.save` method to post it to CloudBoost. Otherwise, only the *local variable* will change, and the data on CloudBoost will stay the same. That's the reason why we need cloud storage: if we kept data on local variables, it would disappear after a page refresh.
```JavaScript
obj.save({
    success: function(obj){
      console.log("Success: "+obj);
    },
    error: function(error){
      alert("Error: "+error);
    }
});
```
*Tip: Keep in mind that the single parameter in `.save` is an object! Use good syntax and remember your commas.*
Notice you use the same variable, `obj`, for `.set` and `.save`. You can repeat the `.set` method as many times as you want, as long as you call `.save` after it. The first method, `success`, executes when the `PUT` is a success and the data was posted to CloudBoost. The `obj` parameter returned is the data that you posted. The second method, `error`, executes when the `PUT` encountered an error. The `error` parameter returned is the error that the server threw. If this happened, there was an mistake caused by either you or the server, and the data was *not* saved. Also, you can change the name of the parameter in both methods. *Important note: this *`set`* method will create a new row. To change data in an existing row, see the *[Changing Data](#changing-data)* section.*<br>*

2. #### Querying/getting data
uses the Ajax/HTTP method `GET`. When querying data, use this:
```JavaScript
query.find({
    success: function(list){
      console.log("Success: "+list);
    },
    error: function(error){
      alert("Error: "+error);
    }
});
```
Notice you use the other variable, `query`, and the method `.find`. The methods are the same as `.save`, except that `list` is an array of all of the rows in the table. Also, no `.save` method is required because no data was pushed to CloudBoost.<br>

3. #### Changing data
uses both methods, `PUT` and `GET`. First you must find the row you want to change. I'm going to use the `.findById` method (see [Methods of querying](#methods-of-querying) section).
```JavaScript
query.findById('id',{
    success: function(list){
      console.log("Success: "+list);
    },
    error: function(error){
      alert("Error: "+error);
    }
});
```
The `list` parameter is a single array, the row. Replace `'id'` with the ID of the row. More on this in the [Methods of querying](#methods-of-querying) section. Next, add a `.set` method to set any column to what you want.
```JavaScript
query.findById('id',{
    success: function(list){
        list.set('columnName','data');
        list.save({
          success: function(obj){
            alert("Data changed");
          },
          error: function(error){
            alert("Error: "+error);
          }
        });
    },
    error: function(error){
      alert("Error: "+error);
    }
});
```
Follow the guidelines in the [Setting/posting data](#settingposting-data) section to set the data. You can repeat this as many times as you want. Notice you `.set` and `.save` to *`list`*, not `obj`. You do this because you are saving to a specific *row*, not the whole object.<br>

4. #### Deleting rows
uses both methods, `PUT` and `GET`, and is similar to the [Changing data](#changing-data) section. You must first find the row you would like to delete:
```JavaScript
query.findById('id',{
    success: function(list){
      console.log("Success: "+list);
    },
    error: function(error){
      alert("Error: "+error);
    }
});
```
Replace `'id'` with the row's ID. More on this in the [Methods of querying](#methods-of-querying) section. Next, add a `.delete` method to delete the row.
```JavaScript
query.findById('id',{
    success: function(list){
      list.delete({
        success: function(obj){
          alert("Data deleted");
        },
        error: function(error){
          alert("Error: "+error);
        }
      });
    },
    error: function(error){
      alert("Error: "+error);
    }
});
```
Notice you call `.delete` on `list`, not `obj`. You do this because you are deleting the *row*, (thank heavens) not the entire TABLE. No `.save` method is needed, as it is built into the `.delete` method.<br>

5. #### Methods of querying:
for every one of these *except* `.findById`, you must call another `.find` after it. All of these set the query to *only the row* that makes the statement true. Once a `.find` method is called after this, it still returns `list` in an array, (except `.findById`, `list` is a single array) *even if* there is only one row that matches the inequality. In that case, use `list[0]` to get it.
  * Equal To: `query.equalTo('columnName','data');`<br>
  This tests if `'data'` is equal to something in any row, in the column `'columnName'`. (`===`)
  * Not Equal To:`query.notEqualTo('columnName','data');`<br>
  This is the opposite of the `.equalTo` method. (`!==`)
  * Contained In: `query.containedIn('columnName',['data1','data2','data3']);`<br>
  This tests if *any* of the strings in the array are equal to data in the column `'columnName'` (`OR`). In other words, this is a multiple-option `.equalTo` method.
  * Not Contained In: `query.notContainedIn('columnName',['data1','data2','data3']);`<br>
  This is the opposite of the `.containedIn` method.
  * Contains All: `query.containsAll('columnName',['data1','data2','data3']);`<br>
  This tests if *all* of the strings in the array are equal to data in the column `'columnName'` (`AND`). In other words, this is the same as `.containedIn` method, but inclusive. ALL the values must be equal.
  * Greater Than: `query.greaterThan('columnName',42);`<br>
  This tests if data in `'columnName'` is > (greater than) `42`.
  * Less Than: `query.lessThan('columnName',42);`<br>
  This tests if data in `'columnName'` is < (less than) `42`.
  * Greater Than or Equal To: `query.greaterThanEqualTo('columnName',42);`<br>
  This tests if data in `'columnName'` is ≥ (greater than or equal to) `42`.
  * Less Than or Equal To: `query.lessThanEqualTo('columnName',42);`<br>
  This tests if data in `'columnName'` is ≤ (less than or equal to) `42`.
  * Starts With: `query.startsWith('columnName','a');`<br>
  This tests if data in `'columnName'` starts with the string `'a'`. It can have anything after it, but it must have `'a'` at the beginning.
  * Or: `query.or(query1,query2);`<br>
  This acts as a simple `OR` operator between two existing queries. You must create two more variables for each query, use one of these methods, and then compare them with the `.or` method. You must call the `.find` method on the same variable that you called the `.or` method on. (`||`)
  * Order By Ascending: `query.orderByAsc('columnName')`<br>
  This will give you the same array as if you just called `.find`, but in *ascending* order.
  * Order By Descending: `query.orderByDesc('columnName')`<br>
  This will give you the same array as if you just called `.find`, but in *descending* order.
  * Find By ID: `query.findById('id',{ /* Callback functions */ });`<br>
  This is the only method that does not require a follow-up `.find`. You must replace `'id'` with the ID of the row. This can be found in the first column of the row. The callback functions are the normal `.find` callbacks, `success` and `error`.

#### CloudUser
*This CloudBoost variable is used with an already-existing table, the Users table. It's used for websites where users are involved. Also, *`CB.CloudUser.current`* is another variable that has the info of the user that is logged in. If the user is logged out, `CB.CloudUser.current` is null.*

*Important note: This section requires knowledge of the basics, which you can find all in [CloudObject and CloudQuery](#cloudobject-and-cloudquery). I would recommend not reading this section until you have read the previous one.*<br>

Since `CloudUser` is used with a pre-existing table, you don't need to create a new one. Just initialize like normal and create the variables.
##### Constructor
```JavaScript
var user = new CB.CloudUser();
```
Note that we are using `CloudUser`. You also don't need any parameters because no table name is required. Now that the variable is declared, we can sign up, log in, and log out users, faster that ever before!
1. #### Sign up
uses the Ajax/HTTP method `PUT`, and is basically the same thing as the `.save` method. To sign up is pretty simple; just use `.set` to set the `username`, `password`, and `email` to the local variable:
```JavaScript
user.set('username','abc');
user.set('password','xyz');
user.set('email','test@example.com');
```
The `email` must not be already registered with a different user.<br>
Then use the `.signUp` method like you would call `.save`:
```JavaScript
user.signUp({
    success: function(new_user){
      console.log(new_user);
      alert("Signed Up!");
    },
    error: function(error){
      alert("Error: "+error);
    }
});
```
Take note that the `password` column is **encrypted**. When using a query, you won't be able to see it.<br><br>
The parameters in `.signUp` are the same as `.save` (`new_user` is the user that signed up). This also sets `CB.CloudUser.current` to the user that signed up.

2. #### Log In
uses the Ajax/HTTP methods `PUT` and `GET`. To log a user in, `.set` to `user` with *only* the submitted username and password.
```JavaScript
user.set('username','xyz');
user.set('password','abc');
```
Now, use `.logIn` like you would `.save`:
```JavaScript
user.logIn({
    success: function(new_user){
      alert("Logged in!");
      console.log(new_user);
    },
    error: function(error){
      alert("Error: "+error);
    }
});
```
Keep in mind that `error` could be the server's error, *or* the client's. Most likely, since you are using `.logIn`, the error will be caused by an unsuccessful login attempt. In this case, there was an error because the user submitted the wrong username and password. If the user logs in correctly, it sets `CB.CloudUser.current` to the user that is logged in. Also, `new_user` is the user that logged in.

3. #### Log out
This is a simple method; all it does is set `CB.CloudUser.current` to `null`. No `.set`s are required. You do, however, need to call `.logOut` on `CB.CloudUser.current`, not `user`:
```JavaScript
CB.CloudUser.current.logOut({
    success: function(old_user){
      alert("Logged out!");
      console.log(old_user);
    },
    error: function(error){
      alert("Error: "+error);
    }
});
```
Note that this will log out the *current CloudUser* (hence the variable `CB.CloudUser.current`).

4. #### Change password
This is a method to change a user's password (after they already initiated it with `CB.signUp`), as they might want to do if they entered a weak password. Again, this is called on `CB.CloudUser.current`, as you are changing the *current user*'s password.
```JavaScript
CB.CloudUser.current.changePassword('current_password','new_password',{
  success: function(current_user){
    alert("Password changed");
    console.log(current_user);
  },
  error: function(error){
    alert("Error: "+error);
  }
});
```
This method takes three parameters: `'current_password'`, the user's old password, `'new_password'`, the user's new  password, and the regular callback function. Note that the `error` function will be called if `'current_password'` is incorrect, i.e. is not the password that the user had before.

5. #### Reset password
This is similar to the `.changePassword` method, but instead of calling the function with all of the parameters there, it sends an email to the email address given, which takes them to a link to change their password. This is very configurable, and you can change the email method and website, etc. from the CloudBoost website.
```JavaScript
CB.CloudUser.resetPassword('email_address',{
  success: function(){
    alert("Email sent");
  },
  error: function(error){
    alert("Error: "+error);
  }
});
```
This method takes two parameters: `'email_address'`, the email address to which the email will be sent, and the regular callback function.

#### CloudGeoPoint
*This is used for locations only. It is slightly similar to CloudObject, except more focused on the Geo Point than posting and getting data. You don't need a table for this, it stores the values away from user viewing.*

##### Constructor
```JavaScript
var point = new CB.CloudGeoPoint(42.95,7.3);
```
This constructor takes two parameters: latitude and longitude, respectively, of the point you want.

1. #### Distance in Kilometers
This takes the distance of two points in a straight line, in **kilometers**.<br>
First, declare the two points you want to compare:
```JavaScript
var point = new CB.CloudGeoPoint(42.95,7.3);
var point2 = new CB.CloudGeoPoint(4.79,14.33);
```
Then compare them:
```JavaScript
console.log(point.distanceInKMs(point2));
```
This logs the distance, but you can do whatever you want with it. You can call `.distanceInKMs` on either point, as long as you put the other in the parameter for the aforementioned method.

2. #### Distance in Miles
This takes the distance of two points in a straight line, in **miles**.<br>
First, declare the two points:
```JavaScript
var point = new CB.CloudGeoPoint(42.95,7.3);
var point2 = new CB.CloudGeoPoint(4.79,14.33);
```
Then compare:
```JavaScript
console.log(point.distanceInMiles(point2));
```
Note the difference; `.distanceInKMs` to `.distanceInMiles`.

3. #### Distance in Radians
This takes the distance of two points in a straight line, in **<a href="https://en.wikipedia.org/wiki/Radian" target="_blank">radians</a>**.<br>
First, declare the two points (this is getting repetitive):
```JavaScript
var point = new CB.CloudGeoPoint(42.95,7.3);
var point2 = new CB.CloudGeoPoint(4.79,14.33);
```
Then compare, like always:
```JavaScript
console.log(point.distanceInRadians(point2));
```
Note the *slight* difference; `.distanceInMiles` to `.distanceInRadians`.

Have fun!<br>
  -Camilo

***
Official [CloudBoost](https://cloudboost.io/) docs can be found here:
https://docs.cloudboost.io/
