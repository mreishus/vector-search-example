# vector-search-example

## What is it?

This is a demo application that contains two parts:

- A back end API that looks up similar words based from a well known set of
  word2vec embeddings, `GoogleNews-vectors-negative300.bin.gz`
- A simple front end react app that allows the user to search a list of S&P
  500 companies. It consumes the backend service to let the user search for
  concepts instead of specific words.

## How do I run it?

Open two terminals.

- In the `word-vector-service/` directory, `npm start`.
- In the `front-end/` directory, `npm start`.
- Visit the URL shown by create-react-app in the browser.

## More Info

I walk through the creation of this in a series of blog posts here:
https://matthewreishus.com/post/2017-07-21-word-vector-all-posts/

## Screenshot

![Screenshot](https://raw.githubusercontent.com/mreishus/vector-search-example/master/screenshot.png)
