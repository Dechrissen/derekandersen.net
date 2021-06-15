#!/usr/bin/env node

const http = require('http');
const url = require('url');
const fs = require('fs');
const fetch = require('node-fetch');
var showdown = require('showdown');
const mustache = require('mustache');
const path = require("path");
const config = require("./config.json");


// webserver for blog
http.createServer((req, res) => {
	let responseCode = 404;
	let content = fs.readFileSync('../404.html');
	const urlObj = url.parse(req.url, true);

	// class map to map html tags to certain classes so that css can select them
	const classMap = {
		//p : 'text'
	}
	const bindings = Object.keys(classMap)
	.map(key => ({
	type: 'output',
	regex: new RegExp(`<${key}(.*)>`, 'g'),
	replace: `<${key} class="${classMap[key]}" $1>`
	}));

	// make a new showdown converter with the bindings from the class map
	converter = new showdown.Converter({
		extensions: [...bindings],
		metadata: true,
		openLinksInNewWindow: true
	});

	// check to see if the URL is just 'blog' or 'blog.html', to serve the main blog page
	if ((urlObj.pathname.split('/')[1] === 'blog.html' && !urlObj.pathname.split('/')[2])
		|| (urlObj.pathname.split('/')[1] === 'blog' && !urlObj.pathname.split('/')[2])) {
		// CODE TO CREATE BLOG ENTRY PAGE
		var view = {
			"entries": []
		}

		const dir = '../blog';
		const files = fs.readdirSync(dir);

		files.forEach(file => {
  		if (path.extname(file) == ".md") {
				body = fs.readFileSync('../blog/'+file, 'utf8');
	      html_body = converter.makeHtml(body);
	      metadata = converter.getMetadata();
				title = metadata.title;
				date = metadata.date;
				number = metadata.number;
				filename = path.basename(file, '.md');
				rendered = renderEntry(title, date, number, filename);
    		view.entries.push(rendered);
			}
		})

		console.log(view.entries);

		responseCode = 200;
		content = fs.readFileSync('../blog.html');
	}

	else if (urlObj.pathname.split('/')[1] === 'blog' && urlObj.pathname.split('/')[2]) {


    if (urlObj.pathname.split('/')[2] === 'cool') {
      responseCode = 200;
      body = fs.readFileSync('../blog/foo.md', 'utf8');
      html_body = converter.makeHtml(body);
      metadata = converter.getMetadata();
      content = renderPost(metadata.title, metadata.date, html_body);
    }
    else if (urlObj.pathname.split('/')[2] === 'fun') {
      responseCode = 200;
      text = '# fun!';
      html = converter.makeHtml(text);
      content = html;
    }
    else {
      text = '### sorry we dont have that blog post';
      html = converter.makeHtml(text);
      content = html;
    }

	}

	res.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
	});
	res.write(content);
	res.end();
})
	.listen(config.BLOG_PORT);


// Returns the rendered HTML of a single blog post page
function renderPost (title, date, body) {
  template = fs.readFileSync('../blog/blog-template.mustache', 'utf8');
  rendered = mustache.render(template, { title: title, date: date, body: body });
  return rendered;
}

// Returns the rendered HTML of a blog entry for the blog page
function renderEntry (title, date, number, filename) {
  template = fs.readFileSync('../blog/entry.mustache', 'utf8');
  rendered = mustache.render(template, { title: title, date: date, number: number, filename: filename });
  return rendered;
}
