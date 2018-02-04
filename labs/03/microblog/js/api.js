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
        var msgs = JSON.parse(localStorage.getItem('todo'));
        var msg = {id: msgs.next++, author: author, content: content, upvotes: 0, downvotes: 0};
        msgs.items.push(msg);
        localStorage.setItem('todo', JSON.stringify(msgs)); 
        return msg;
    }
    
    // delete a message given its messageId
    // return a message object
    module.deleteMessage = function(messageId){
        var msgs = JSON.parse(localStorage.getItem('todo'));
        var index = msgs.items.findIndex(function(item){
            return item.id == messageId;
        });
        if (index == -1) return null;
        var m = msgs.items[index];
        msgs.items.splice(index, 1);
        localStorage.setItem('todo', JSON.stringify(msgs));
        return m;
    }
    
    // upvote a message given its messageId
    // return a message object
    module.upvoteMessage = function(messageId){
        var msgs = JSON.parse(localStorage.getItem('todo'));
        var index = msgs.items.findIndex(function(item){
            return item.id == messageId;
        });
        if (index == -1) return null;
        msgs.items[index].upvotes++;
        var m = msgs.items[index];
        localStorage.setItem('todo', JSON.stringify(msgs));
        return m;
    }
    
    // downvote a message given its messageId
    // return a message object
    module.downvoteMessage = function(messageId){
        var msgs = JSON.parse(localStorage.getItem('todo'));
        var index = msgs.items.findIndex(function(item){
            return item.id == messageId;
        });
        if (index == -1) return null;
        msgs.items[index].downvotes++;
        var m = msgs.items[index];
        localStorage.setItem('todo', JSON.stringify(msgs));
        return m;
    }
    
    // get 5 latest messages given an offset 
    // return an array of message objects
    module.getMessages = function(offset=0){
        var msgs = JSON.parse(localStorage.getItem('todo'));
        m = [];
        for(var i=offset; i < Math.min(offset + 5, msgs.items.length); i++){
            m.push(msgs.items[i]);
        }
        return m;
    }
    
    return module;
})();
