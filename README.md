<br>
<div align="center">
<img src='https://raw.githubusercontent.com/MichelML/bbpr/master/media/bbpr.png' width='150'>
<h3 style="text-decordation:none;">Light Speed Pull Requests from Your Terminal</h3>
</div>
<br>
<div align="center">
<img src='https://raw.githubusercontent.com/MichelML/bbpr/master/media/bbpr2.gif'>
</div>

<h1 id="synopsis">Synopsis</h1> 
*bbpr* (BitBucket Pull Requests) is a cross-platform, interactive, configurable, and fast command line program helping you standardize the pull request process between teammates. It is very easy to forget little details when doing a pull request, like a reviewer you had to add, or a description along your demo helping your teammates understand what they should review and where they should look for it. *bbpr* partners up with you on that journey, so that your future pull requests will always be picture perfect.   

<h1 id="synopsis">How it works</h1>
When you start a *bbpr* session, you simply answer questions about your upcoming PR so that *bbpr* can build it for you. Once you are done answering the questions, you can review all the information before sending your PR. Once you confirm each piece of information is accurate, *bbpr* sends the pull request and redirects you to BitBucket if it is successful. If not, you will receive information about why it failed, and you'll be able to adjust. It's that simple.  
 
<h1 id="installation">Installation</h1>
<h3>Step 1: Prerequisites</h3> 
  
First, make sure you have the following installed on your computer: <a href="https://nodejs.org/en/">node.js</a>, <a href="https://www.npmjs.com/">npm</a>, <a href="https://git-scm.com/">git</a>, and <a href="https://www.mercurial-scm.org/">mercurial</a>.   


<h3>Step 2: Npm Install</h3>
  
The very best way to use the latest version of *bbpr* is to install it as a global npm package.
```  
npm install -g bbpr
```     

Congratulations, *bbpr* is now installed properly and you can instantly use the `bbpr` terminal command from any local Mercurial repository linked to a remote BitBucket repository. However, a more useful way to use *bbpr* is to configure it to your personal profile and taste.

<h1 id="Configuration">Use and Configuration</h1>  

*bbpr* comes bundled with a configuration file (`bbpr.config.js`) by default. That being said, it is recommended that you enter some information in it so it becomes faster to build your pull requests by being prompted with less questions to answer. You can edit your *bbpr* configuration file  (`bbpr.config.js`) any time with the following bbpr command options: 

`bbpr --c` - opens your configuration file so you can edit it manually.
`bbpr --c reset` - resets your configuration file to the default configuration file
`bbpr --c <path to a local config js file>` - replaces your current config file with the local config file specified
`bbpr --c <path to a remote (http/https) config js file>` - replaces your current config file with the remote config file specified **NOT YET SUPPORTED**
  
Default configuration file overview:  

```javascript 
module.exports = {
  organization: {
    name: '' // String. Add the name of your BitBucket username or your organization name under which your repository can be found (ex: michelmoreau, mycompanyid )
        // This will be used to access the proper BitBucket API path => https://api.bitbucket.org/2.0/repositories/2.0/repositories/{will_be_utilized_here}/{repo_slug}/pullrequests
        // For more information see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/pullrequests#post
  },
  user: {
    name: '', // String. Provide your BitBucket username (ex: michelmoreaul) under which you will make your pull requests, so you don't have to type it at each session.
    password: null, // null or String.
        // If null and cachePwd is set to true, this property will be set to the (encrypted) password you entered via the prompt for your next *bbpr* sessions.
        // If not null and cachePwd is set to true, it will use the encrypted password stored in this property.
        // In any other case, you will be prompted at each *bbpr* session to provide your BitBucket password.
    cachePwd: false // Boolean. See the password property for detailed explanation.
  },
  demo: {
    shouldPrompt: false, // Boolean. Set to true if you'll need a demo link with your PR.
    shouldPromptDescription: false, // Boolean. Set to true if you'll need a description with your demo.
    basePath: '' // String. Base path to your demo (ex. https://mydemo.com/). Provide only if needing a demo. It will be ignored otherwise.
  },
  reviewers: {
    default: [], // Array of String. Each entry must be a valid BitBucket username. These are the reviewers who are assign to reviewing your work. An empty Array is also valid.
    potential: [] // Array of String. Each entry must be a valid BitBucket username. These are the reviewers who may be assigned to reviewing your work. An empty Array is also valid.
  },
  branches: {
    source: {
      close: true // Boolean. Set to false if you do not want your source branch to be closed after merging in the destination branch.
    },
    dest: {
      default: 'default' // String. Set to your main branch (ex: master or default), or the branch to which you are making PRs most often.
    }
  },
  globalVars: {
    openFileCommand: '' // String. Your preferred terminal command to open your config file (javascript file). *bbpr* uses a default command according to your platform if empty.
  }
}
```  
Once you configured *bbpr* to your taste, you are ready to go. You can run `bbpr` from any local repository for which you want to make a pull request, and a session will start.  

That's it, may you and your teammates enjoy the *bbpr* way of doing BitBucket pull requests!
  
<h1 id="contribute">Contribute</h1>

Please do not hesitate to make any change at any time to *bbpr* by submitting a pull request.
  
<h1 id="maintainer">Maintainer</h1>
 
Michel Moreau - [michmoreau.l@gmail.com](mailto:michmoreau.l@gmail.com?Subject=*bbpr*%20Project) 
