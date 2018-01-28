window.onload = (function(){
    "use strict";
    // your code goes here
    var ind = 0; 
    var curr_imgId = -1;
    var c_ind = 0;
    if (!localStorage.getItem('images')){
        localStorage.setItem('images', JSON.stringify({next: 0, items: []}));
    }
    else{
        document.getElementById("curr_img").src = api.getImage(ind).url;
        document.getElementById("img_title").textContent = api.getImage(ind).title +
            " by " +
            api.getImage(ind).author;
        curr_imgId = api.getImage(ind).imageId;
    }
    if (!localStorage.getItem('comments')){
        localStorage.setItem('comments', JSON.stringify({next: 0, items: []}));
    }
    else{
        clearComments();
        loadComments(curr_imgId, c_ind);
    }

    //Clear all loaded comments
    function clearComments(){
        var cs = document.getElementById("comments");
        
        while (cs.firstChild) {
            cs.removeChild(cs.firstChild);
        }
        document.getElementById("c_prev").disabled = true;
        document.getElementById("c_next").disabled = true;
    }

    // Given imgId and offset load comments
    function loadComments(imgId, offset){
        var cs = api.getComments(imgId, offset);
        var all_cs = [];
        var comments = JSON.parse(localStorage.getItem('comments'));
        var len = comments.items.length - 1;
        for (var i = 0; i <= len; i++){
            if (comments.items[i].imageId == curr_imgId) all_cs.push(comments.items[i]);
        }
        for (var i=0; i < cs.length; i++){
            insertComment(cs[i]);
        }
        if(all_cs.length - offset > 10){
            document.getElementById("c_next").disabled = false;
        }
        if(offset > 0){
            document.getElementById("c_prev").disabled = false;
        }
    }

    //Add a comment to the html
    function insertComment(item){
        var element = document.createElement('div');
        element.className = "message";
        element.innerHTML=`
        <div class="message_user">
            <img class="message_picture" src="media/user.png">
            <div class="message_username">` + item.author +
            `</div>` +
        `</div>` +
        `<div class="message_content">` + item.content +
        `</div>` +
        `<div class="delete-icon icon"></div>
    `;
          element.querySelector('.delete-icon').addEventListener('click', function(){
            api.deleteComment(item.commentId);
            element.parentNode.removeChild(element);
        }); 
        document.querySelector('#comments').appendChild(element);
    }

    // Hide or show the image submit form
    document.getElementById('form_hide').addEventListener('click', function(){
        
        var show = document.getElementById('form_hide');
        var form = document.getElementById('submit_img_form');
        if (form.style.display === "none") {
            form.style.display = "flex";
            show.innerText = "Hide";
        } else {
            form.style.display = "none";
            show.innerText = "Add your own image";
        }
    });

    // Add a picture to the gallery
    document.getElementById('submit_img_form').addEventListener('submit', function(e){
        e.preventDefault();
        var title = document.getElementById("post_title").value;
        var auth = document.getElementById("post_auth").value;
        var url = document.getElementById("post_url").value;
        api.addImage(title, auth, url);
        
        document.getElementById("submit_img_form").reset();
    });

    // Previous image in gallery
    document.getElementById('prev').addEventListener('click', function(){
        var pic = document.getElementById("curr_img");
        var title = document.getElementById("img_title");
        if(ind <= 0){
            ind = -1;
            pic.src = "https://imgs.xkcd.com/comics/donald_knuth.png";
            curr_imgId = -1;
            title.textContent = "We've run out of images for you, try adding your own";
        }
        else{
            ind--;
            var ids = api.getAllImageIds();
            var img = api.getImage(ids[ind]);
            pic.src = img.url;
            curr_imgId = img.imageId;
            title.textContent = img.title + " by " + img.author;
        }
        c_ind = 0;
        clearComments();
        loadComments(curr_imgId, c_ind);
    });

    // Next image in gallery
    document.getElementById('next').addEventListener('click', function(){
        var ids = api.getAllImageIds();
        
        var pic = document.getElementById("curr_img");
        var title = document.getElementById("img_title");
        if (ind + 1 > ids.length - 1){
            ind = ids.length;
            pic.src = "https://imgs.xkcd.com/comics/donald_knuth.png";
            curr_imgId = -1;
            title.textContent = "We've run out of images for you, try adding your own";
        }
        else{
            ind++;
            var img = api.getImage(ids[ind]);
            pic.src = img.url;
            curr_imgId = img.imageId;
            title.textContent = img.title + " by " + img.author;
        }
        c_ind = 0;
        clearComments();
        loadComments(curr_imgId, c_ind);
    });

    // Next 10 comments
    document.getElementById('c_next').addEventListener('click', function(){
        c_ind = c_ind + 10;
        clearComments();
        loadComments(curr_imgId, c_ind);
    });

     // Last 10 comments
     document.getElementById('c_prev').addEventListener('click', function(){
        c_ind = c_ind - 10;
        clearComments();
        loadComments(curr_imgId, c_ind);
    });

    //Submit comment
    document.getElementById('submit_comment_form').addEventListener('submit', function(e){
        e.preventDefault();
        var auth = document.getElementById("comment_auth").value;
        var content = document.getElementById("comment_content").value;
        var comment = api.addComment(curr_imgId, auth, content);
        insertComment(comment);
        document.getElementById("submit_comment_form").reset();

    });
    /*
    document.getElementById('create_message_form').addEventListener('submit', function(e){
        // prevent from refreshing the page on submit
        e.preventDefault();
        // read form elements

        var username = document.getElementById("post_name").value;
        var url = document.getElementById("post_content").value;
 
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
            
            '<div class="delete-icon icon"></div>';
        // add this element to the document
        
        elmt.querySelector('.delete-icon').addEventListener('click', function(e){
            //Delete message
            elmt.parentNode.removeChild(elmt);
        });
        
        document.getElementById("messages").prepend(elmt);
    });
    */
    
}());