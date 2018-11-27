# OfxEditorFlask

Before I go any further, OFX and FLX are the same thing.  I changed the name to FLX because OFX (which stood for Open Effects) also stands for Open Financial Exchange.

In the beginning, the FLX pedal had it's own embedded server which would serve the Editor to the client browser.  I later found out that a large company had done something very similar and patented it.  

I didn't want to rewrite all the Javascript code (though in the end, I wound up rewriting the whole editor using Java with JavaFX, which did look significantly better), so I looked for a way to make it part of a desktop application.  I tried Node WebKit (Node.js for creating desktop apps), but the use of the usb for connecting to the pedal combined with node's asynchronous nature and some hardware factors made it difficult enough for me to go back to Python, using flask and WebUI.
