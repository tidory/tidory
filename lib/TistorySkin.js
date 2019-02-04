const url = require('url'),	
			FormData = require('form-data'),
			fs = require('fs'),
			walk = require('walk'),
			path = require('path')
;

const Storage = require('./Storage'),
      RemoteController = require('./RemoteController')
;

/**
 * Q. How to Check Response properties?
 * A. Reference Your skin edit page with developer tools
 */
class TistorySkin extends RemoteController {

	/**
	 * Create TistorySkin Instance
	 * 
	 * @param {string} BLOG_URL 
	 * @param {string} TSSESSION 
	 */
	constructor(BLOG_URL, TSSESSION) {
    super(BLOG_URL, TSSESSION);

		/**
		 * Tistory Skin Storage
		 */
		this.storage = new Storage(BLOG_URL, TSSESSION)
	}

	/**
	 * Prepare TISTORY SKIN
	 * 
	 * @return {object}
	 */
	async prepare() {
    return await this.request('get', '/manage/design/skin/html.json');
	}

	/**
	 * Get TISTORY SKIN settings
	 * 
	 * @return {object}
	 */
	async settings() {
    return await this.request('get', '/manage/design/skin/current.json');
	}

	/**
	 * Change Tistory Skin
	 * 
	 * @param {string} html 
	 * @param {string} css 
	 * @param {boolean} isPreview 
	 * 
	 * @return {string} Preview URL
	 */
	async change(html, css, isPreview) {
    let response = await this.request('post', '/manage/design/skin/html.json', {
      data: {
        'html': html,
        'css': css,
        'isPreview': isPreview
      }
    });

		return url.resolve(this.BLOG_URL, response);
	}

	/**
	 * Upload a File on file storage of Current Tistory Skin
	 * 
	 * @param {string} path 
	 */
	async upload(path) {
		let formData = new FormData();
		formData.append('files', fs.createReadStream(path));

		return await this.request('post', '/manage/design/skin/resource.json', {
      data: formData,
      headers: formData.getHeaders()
    });
	}

	/**
	 * Delete a File on file storage of Current Tistory Skin
   * 
   * ex) images/script.js
	 * 
	 * @param {string} path 
   * 
   * @return {object}
	 */
	async unlink(path) {
		return await this.request('delete', '/manage/design/skin/resource.json', {
      data: {
				filename: path
			}
    });
	}

	/**
	 * Delete all files on files storage of Current Tistory Skin
	 */
	async clear() {
		let stat = await this.prepare(),
				uploadedFiles = stat.files.list
		;
		uploadedFiles.forEach(async fileinfo => {
			let filename = fileinfo.url.replace(
				/https?:\/\/tistory[0-9]{1}.daumcdn.net\/tistory\/[0-9]*\/skin\/(.*?)/
				, "$1"
			);

			await this.unlink(filename);
		});
	}

	/**
	 * set Tistory Skin
	 * 
	 * @param {string} skinname
	 * 
	 * @return {object}
	 */
	async set(skinname) {
		let formData = new FormData();

		formData.append('name', skinname);

    return await this.request('post', '/manage/design/skin/set.json', {
      data: formData,
      headers: formData.getHeaders()
    });
	}

  /**
   * Deploy Tistory Skin
   * 
   * @param {string} dist
   */
	async deploy(dist) {
		let guards = { skin: 'skin.html', css: 'style.css' };

		Object.keys(guards).forEach(key => {
			let content = fs.readFileSync(path.join(dist, guards[key]), "utf8");
			guards[key] = content;
		});

		await this.prepare();
		await this.change(guards.skin, guards.css, false);

		let walker  = walk.walk(dist, { followLinks: false });

		walker.on('file', async (root, stat, next) => {
			if(!Object.values(guards).includes(stat.name)) {
				await this.upload(root + '/' + stat.name);
			}
			next();
		});
	}

	/**
	 * Get preview
	 * 
	 * **mode** is able to be \
	 * 'index', 'entry', 'category', 'tag', 'location', 'media', 'guestbook'
	 * 
	 * @param {string} mode
	 * 
	 * @return {string} HTML
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

    return await this.request('post', '/manage/previewSkin.php', {
      data: formData,
      headers: formData.getHeaders()
    });
	}
}

module.exports = TistorySkin;