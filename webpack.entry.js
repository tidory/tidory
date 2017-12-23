// Dependencies
	// less
		import "./style.css"
	// assets
		//css
			const css = require.context(
				"./assets/css", 
				true, 
				/^\.\/.*\.css$/
			);    
			css.keys().map(css);