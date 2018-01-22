window.onload = (function(){
    "use strict";
    // your code goes here
    
    if (!localStorage.getItem('todo')){
        localStorage.setItem('todo', JSON.stringify({next: 0, items: []}));
    }
    
    function insertItem(item){
        var element = document.createElement('div');
        element.className = "item";
        element.innerHTML = '<div class="item_content">' + item.content + '</div>' +
            '<div class="delete-icon icon"></div>';
          element.querySelector('.delete-icon').addEventListener('click', function(){
            api.deleteItem(item.id);
            element.parentNode.removeChild(element);
        }); 
        document.querySelector('#items').prepend(element);
    }
    
    document.getElementById('create_message_form').addEventListener('submit', function(e){
        // prevent from refreshing the page on submit
        e.preventDefault();
        // read form elements
        var todo = JSON.parse(localStorage.getItem('todo'));
        var upvotes = 0;
        var downvotes = 0;
        var username = document.getElementById("post_name").value;
        var content = document.getElementById("post_content").value;
        var index = todo.next;
        var item = {id: todo.next++, content: [username, content]};
        // clean form
        document.getElementById("create_message_form").reset();
        // create a new message element
        var elmt = document.createElement('div');
        elmt.className = "message";
        elmt.innerHTML='<div class="message_user">' +
            '<img class="message_picture" src="media/user.png" alt="' + username + '">' +
            '<div class="message_username">' + username + '</div>' +
            '</div>' +
            '<div class="message_content">' + content + '</div>' +
            '<div class="upvote-icon icon">' + upvotes + '</div>' +
            '<div class="downvote-icon icon">' + downvotes + '</div>' +
            '<div class="delete-icon icon"></div>';
        // add this element to the document
        elmt.querySelector('.upvote-icon').addEventListener('click', function(){
            upvotes++;
            elmt.querySelector('.upvote-icon').innerHTML = upvotes;
        });
        elmt.querySelector('.downvote-icon').addEventListener('click', function(){
            downvotes++;
            elmt.querySelector('.downvote-icon').innerHTML = upvotes;
        });
        elmt.querySelector('.delete-icon').addEventListener('click', function(e){
            //Delete message
            elmt.parentNode.removeChild(elmt);
            todo.items.splice(index, 1);
            localStorage.setItem('todo', JSON.stringify(todo));
            
        });
        
        todo.items.push(item);
        localStorage.setItem('todo', JSON.stringify(todo));
        document.getElementById("messages").prepend(elmt);
    });
    window.addEventListener('load', function(){
        var todo = JSON.parse(localStorage.getItem('todo'));
        todo.items.forEach(insertItem);
        document.querySelector('#add_item').addEventListener('submit', function(e){
            e.preventDefault();
            var content = document.querySelector('#content_form').value;
            document.querySelector('#add_item').reset();
            var item = api.addItem(content);
            insertItem(item);
        });
    });  
}());

