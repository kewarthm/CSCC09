var api = (function(){
    var module = {};
    
    /*  ******* Data types *******
        image objects must have at least the following attributes:
            - (String) imageId 
            - (String) title
            - (String) author
            - (String) url
            - (Date) date
    
        comment objects must have the following attributes
            - (String) commentId
            - (String) imageId
            - (String) author
            - (String) content
            - (Date) date
    
    ****************************** */ 
    
    var next = 0;
    // add an image to the gallery
    // return an image object
    module.addImage = function(title, author, url){
        var d = new Date();
        var images = JSON.parse(localStorage.getItem("images"));
        var i = {"imageId": images.next++,"title": title, "author": author, "url": url, "date": d};
        images.items.push(i);
        localStorage.setItem('images', JSON.stringify(images));
        return i;
    }
    
    // delete an image from the gallery given its imageId
    // return an image object
    module.deleteImage = function(imageId){
        var images = JSON.parse(localStorage.getItem('images'));
        var index = images.items.findIndex(function(item){
            return item.imageId == imageId;
        });
        if (index == -1) return null;
        var i = images.items[index];
        images.items.splice(index, 1);
        localStorage.setItem('images', JSON.stringify(images));
        return i;
    }
    
    // get an image from the gallery given its imageId
    // return an image object
    module.getImage = function(imageId){
        var images = JSON.parse(localStorage.getItem("images"));
        var index = images.items.findIndex(function(item){
            return item.imageId == imageId;
        });
        if (index == -1) return null;
        var i = images.items[index];
        return i;
    }
    
    // get all imageIds from the gallery
    // return an array of (String) imageId
    module.getAllImageIds = function(){
        var images = JSON.parse(localStorage.getItem("images"));
        var len = images.items.length - 1;
        var ids = [];
        for (var i = 0; i <= len; i++){
            ids.push(images.items[i].imageId);
        }
        return ids;

    }
    
    // add a comment to an image
    // return a comment object
    module.addComment = function(imageId, author, content){
        var d = new Date();
        var comments = JSON.parse(localStorage.getItem("comments"));
        var c = {commentId: comments.next++, "imageId": imageId,"title": title, "author": author, "content": content, "date": d};
        comments.items.push(c);
        localStorage.setItem('comments', JSON.stringify(comments));
        return c;    
    }
    
    // delete a comment to an image
    // return a comment object
    module.deleteComment = function(commentId){
        var comments = JSON.parse(localStorage.getItem('comments'));
        var index = comments.items.findIndex(function(item){
            return item.commentId == commentId;
        });
        if (index == -1) return null;
        var c = comments.items[index];
        comments.items.splice(index, 1);
        localStorage.setItem('comments', JSON.stringify(comments));
        return c;
    }
    
    // get 10 latest comments given an offset 
    // return an array of comment objects
    module.getComments = function(imageId, offset=0){
        var cs = [];
        var ret = [];
        var comments = JSON.parse(localStorage.getItem('comments'));
        var len = comments.items.length - 1;
        for (var i = 0; i <= len; i++){
            if (comments.items[i].imageId == imageId) cs.push(comments.items[i]);
        }
        for (var c=offset; c < Math.min(cs.length, offset + 10); c++){
            ret.push(cs[c]);
        }
        return ret;
    }
    
    return module;
})();