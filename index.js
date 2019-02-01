const url = require('url'),	
			FormData = require('form-data')
;

/**
 * Q. How to Check Response properties?
 * A. Reference Your skin edit page with developer tools
 */
class TistorySkin {

	/**
	 * Create TistorySkin Instance
	 * 
	 * @param {string} BLOG_URL 
	 * @param {string} TSSESSION 
	 */
	constructor(BLOG_URL, TSSESSION) {

		/** 
		 * Your Tistory BLOG URL for testing
		 * 
		 * ex) https://appwriter.tistory.com
		 */
		this.BLOG_URL = BLOG_URL,

		/**
		 * WARNING: TSSESSION is Tistory Session Cookie
		 */
		this.TSSESSION = TSSESSION
		
		this.axios = require('axios').create({
			baseURL: BLOG_URL,
			headers: {
				'Content-Type': 'application/json',
				'Referer': url.resolve(BLOG_URL, '/manage/design/skin/edit'),
				'Cookie': 'TSSESSION='+TSSESSION
			}
		});
	}

	/**
	 * Prepare TISTORY SKIN
	 * 
	 * @return {object}
	 */
	async prepare() {
		return (await this.axios.get('/manage/design/skin/html.json')).data
	}

	/**
	 * Get Current Status
	 * 
	 * @return {object}
	 */
	async settings() {
		return (await this.axios.get('/manage/design/skin/current.json')).data;
	}

	/**
	 * Change Tistory Skin
	 * 
	 * @param {string} html 
	 * @param {string} css 
	 * @param {boolean} isPreview 
	 * 
	 * @return {string}
	 */
	async change(html, css, isPreview) {
		let { data } = await this.axios.post('/manage/design/skin/html.json', {
			'html': html,
			'css': css,
			'isPreview': isPreview
		})

		return url.resolve(this.BLOG_URL, data);
	}

	/**
	 * Get preview
	 * 
	 * **mode** is able to be \
	 * 'index', 'entry', 'category', 'tag', 'location', 'media', 'guestbook'
	 * 
	 * @param {string} mode
	 * 
	 * @return {string}
	 */
	async preview(mode) {
		let settings = await this.settings(),	
				formData = new FormData()
		;

		formData.append('mode', mode);
		formData.append('skin', settings.skin.name);
		formData.append('skinSettings', JSON.stringify(settings.skinSettings));
		formData.append('variableSettings', JSON.stringify(settings.variableSettings));
		formData.append('homeType', settings.home.type);

		let { data } = await this.axios.post('/manage/previewSkin.php', formData, { 
				headers: formData.getHeaders() 
			}
		);

		return data;
	}
}

module.exports = TistorySkin;