var api = (function(){
    var module = {};
    
    /*  ******* Data types *******
        message objects must have at least the following attributes:
            - (String) messageId 
            - (String) author
            - (String) content
            - (Int) upvote
            - (Int) downvote 
    
    ****************************** */ 
    
    // add a message
    // return a message object
    module.addMessage = function(author, content){
        // store data here
<<<<<<< HEAD
        var msg = {author: author, content: content}
        localStorage.setItem(1, JSON.stringify(msg)); 
        return msg
=======
        return {author: author, content: content}
>>>>>>> refs/remotes/ThierrySans/master
    }
    
    // delete a message given its messageId
    // return a message object
    module.deleteMessage = function(messageId){
        
    }
    
    // upvote a message given its messageId
    // return a message object
    module.upvoteMessage = function(messageId){
        
    }
    
    // downvote a message given its messageId
    // return a message object
    module.downvoteMessage = function(messageId){
        
    }
    
    // get 5 latest messages given an offset 
    // return an array of message objects
    module.getMessages = function(offset=0){
        
    }
    
    return module;
<<<<<<< HEAD
})();
=======
})();
>>>>>>> refs/remotes/ThierrySans/master
