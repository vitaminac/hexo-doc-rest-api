git clone https://github.com/vitaminac/hexo-theme-doc.git hexo-theme-doc
cd hexo-theme-doc
call npm install
call npm run test
call npm run lint
call npm link

cd ..

git clone -b gh-pages-source https://github.com/vitaminac/hexo-theme-doc.git hexo-theme-doc-site
cd hexo-theme-doc-site
call npm install
call npm link hexo-theme-doc

call hexo server -p 5000