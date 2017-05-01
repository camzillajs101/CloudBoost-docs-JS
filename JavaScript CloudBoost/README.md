# CloudBoost
##### By Camilo. Always.
***
### Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Usage](#usage)
    * [Setup](#setup)
    * [CloudObject and CloudQuery](#cloudobject-and-cloudquery)
        * [Setting/posting data](#settingposting-data)
        * [Querying/getting data](#queryinggetting-data)
        * [Changing data](#changing-data)
        * [Deleting rows](#deleting-rows)
        * [Methods of querying](#methods-of-querying)
    * [CloudUser](#clouduser)
        * [Sign Up](#sign-up)
        * [Log In](#log-in)
        * [Log Out](#log-out)
    * [CloudSearch](#cloudsearch)

### Description
This is an API called [CloudBoost](https://cloudboost.io) used with JavaScript to post and get data from the cloud storage. It uses HTTP `GET` and `PUT` requests.

### Installation
No installation required, unless you are using Node.js. In that case, make sure you are in your app's directory, and run this command in the command line:
```bash
npm install cloudboost
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
  * `query.equalTo('columnName','data');`<br>
  This tests if `'data'` is equal to something in any row, in the column `'columnName'`.
  * `query.notEqualTo('columnName','data');`<br>
  This is the opposite of the `.equalTo` method.
  * `query.containedIn('columnName',['data1','data2','data3']);`<br>
  This tests if *any* of the strings in the array are equal to data in the column `'columnName'` (`OR`). In other words, this is a multiple-option `.equalTo` method.
  * `query.notContainedIn('columnName',['data1','data2','data3']);`<br>
  This is the opposite of the `.containedIn` method.
  * `query.containsAll('columnName',['data1','data2','data3']);`<br>
  This tests if *all* of the strings in the array are equal to data in the column `'columnName'` (`AND`). In other words, this is the same as `.containedIn` method, but inclusive. ALL the values must be equal.
  * `query.greaterThan('columnName',42);`<br>
  This tests if data in `'columnName'` is > (greater than) `42`.
  * `query.lessThan('columnName',42);`<br>
  This tests if data in `'columnName'` is < (less than) `42`.
  * `query.greaterThanEqualTo('columnName',42);`<br>
  This tests if data in `'columnName'` is ≥ (greater than or equal to) `42`.
  * `query.lessThanEqualTo('columnName',42);`<br>
  This tests if data in `'columnName'` is ≤ (less than or equal to) `42`.
  * `query.startsWith('columnName','a');`<br>
  This tests if data in `'columnName'` starts with the string `'a'`. It can have anything after it, but it must have `'a'` at the beginning.
  * `query.or(query1,query2);`<br>
  This acts as a simple `OR` operator between two existing queries. You must create two more variables for each query, use one of these methods, and then compare them with the `.or` method. You must call the `.find` method on the same variable that you called the `.or` method on.
  * `query.orderByAsc('columnName')`<br>
  This will give you the same array as if you just called `.find`, but in *ascending* order.
  * `query.orderByDesc('columnName')`<br>
  This will give you the same array as if you just called `.find`, but in *descending* order.
  * `query.findById('id',{ /* Callback functions */ });`<br>
  This is the only method that does not require a follow-up `.find`. You must replace `'id'` with the ID of the row. This can be found in the first column of the row. The callback functions are the normal `.find` callbacks, `success` and `error`.

#### CloudUser
*This CloudBoost variable is used with an already-existing table, the Users table. It's used for websites where users are involved. Also, *`CB.CloudUser.current`* is another variable that has the info of the user that is logged in. If the user is logged out, `CB.CloudUser.current` is null.*

*Important note: This section requires knowledge of the basics, which you can find all in [CloudObject and CloudQuery](#cloudobject-and-cloudquery). I would recommend not reading this section until you have read the previous one.*<br>

Since `CloudUser` is used with a pre-existing table, you don't need to create a new one. Just initialize like normal and create the variables:
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
      alert("Error: "+error)
    }
});
```
Note that this will log out the *current CloudUser* (`CB.CloudUser.current`).

#### CloudSearch
*This is a Cloud variable not used for posting at all, but just for getting and sorting the data, or filtering it.*

*Same thing as the previous section; you shouldn't read this until you have read [CloudObject and CloudQuery](#cloudobject-and-cloudquery), or unless you already have previous knowledge of CloudBoost.*

* First, you must create a new table (unless you already have an existing one that you will use).
* Then, initiate, like always:

```JavaScript
var search = new CB.CloudSearch('TableName');
```
Again, replace `'TableName'` with the name of your table.

*Important note: Remember, you always need to initiate the `CloudApp` (see [Setup](#setup)) at the beginning of your files. If you are doing this in different files, each of them need their own `.init`. However, if you are doing this all in the same CloudApp, you will use the same app ID and client key.*

Have fun!<br>
  -Camilo

***
Official [CloudBoost](https://cloudboost.io/) docs can be found here:
https://docs.cloudboost.io/
