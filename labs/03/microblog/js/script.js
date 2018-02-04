window.onload = (function(){
    "use strict";
    // your code goes here
    
    if (!localStorage.getItem('todo')){
        localStorage.setItem('todo', JSON.stringify({next: 0, items: []}));
    }
    
    function insertItem(item){
        var element = document.createElement('div');
        element.className = "message";
        element.innerHTML='<div class="message_user">' +
            '<img class="message_picture" src="media/user.png" alt="' + item.author + '">' +
            '<div class="message_username">' + item.author + '</div>' +
            '</div>' +
            '<div class="message_content">' + item.content + '</div>' +
            '<div class="upvote-icon icon">' + item.upvotes + '</div>' +
            '<div class="downvote-icon icon">' + item.downvotes + '</div>' +
            '<div class="delete-icon icon"></div>';
          element.querySelector('.delete-icon').addEventListener('click', function(){
            api.deleteMessage(item.id);
            element.parentNode.removeChild(element);
        }); 
        document.getElementById('#messages').appendChild(element);
    }
    
    document.getElementById("create_message_form").addEventListener('submit', function(e){
        // prevent from refreshing the page on submit
        e.preventDefault();
        // read form elements
        var todo = JSON.parse(localStorage.getItem('todo'));
        var username = document.getElementById("post_name").value;
        var content = document.getElementById("post_content").value;
        var index = todo.next;
        var item = api.addMessage(username, content);
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
            '<div class="upvote-icon icon">' + 0 + '</div>' +
            '<div class="downvote-icon icon">' + 0 + '</div>' +
            '<div class="delete-icon icon"></div>';
        // add this element to the document
        elmt.querySelector('.upvote-icon').addEventListener('click', function(){
            var m = api.upvoteMessage(item.id);
            elmt.querySelector('.downvote-icon').innerHTML = m.upvotes;
        });
        elmt.querySelector('.downvote-icon').addEventListener('click', function(){
            var m = api.downvoteMessage(item.id);
            elmt.querySelector('.downvote-icon').innerHTML = m.downvotes;
        });
        elmt.querySelector('.delete-icon').addEventListener('click', function(e){
            //Delete message
            elmt.parentNode.removeChild(elmt);
            api.deleteMessage(index);
            
        });
        document.getElementById("#messages").appendChild(elmt);
    });
    window.addEventListener('load', function(){
        var todo = JSON.parse(localStorage.getItem('todo'));
        todo.items.forEach(insertItem);
        
    });  
}());

