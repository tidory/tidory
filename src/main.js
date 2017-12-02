// Dependencies
    // less
        import "./style.less"
    // assets
        //css
            const css = require.context(
                "./assets/css", 
                true, 
                /^\.\/.*\.css$/
            );    
			css.keys().map(css);