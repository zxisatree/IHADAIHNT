// Worker that does the heavy processing
self.addEventListener('message', function(e) {
    if(e.data === 'hang') {
      let val = "";
    
      for (let i = 0; i < 30000; i++) {
        for (let j = 0; j < 30000; j++) {
          val = "Worker returned: " + i + j;
        }
      }
      
      self.postMessage(val);
    }
  });