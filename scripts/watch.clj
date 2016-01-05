(require '[cljs.build.api :as b])

(b/watch "src"
  {:main 'alicorn.core
   :output-to "out/alicorn.js"
   :output-dir "out"})
