<strong>Please note that this project is in active development and several improvements are to be expected in the next weeks/months.</strong>
<br>
<div align="center">
<br>
<img src='https://raw.githubusercontent.com/MichelML/bbpr/master/media/bbpr2.png' width='300'>
<h3><i>bbpr</i></h3>
<h4>Light Speed Pull Requests from Your Terminal</h4>
</div>
<br>
<div align="center">
<img src='https://raw.githubusercontent.com/MichelML/bbpr/master/media/bbpr2.gif'>
</div>

<h1 id="synopsis">Synopsis</h1>  

_bbpr_ (BitBucket Pull Requests) is a cross-platform, interactive, configurable, and fast command line program helping you standardize the pull request process between teammates. It is very easy to forget little details when doing a pull request, like a reviewer you had to add, or a description along your demo helping your teammates understand what they should review and where they should look for it. _bbpr_ partners up with you on that journey, so that your future pull requests will always be picture perfect.   

<h1 id="synopsis">How it works</h1>  

When you start a _bbpr_ session, you simply answer questions about your upcoming PR so that _bbpr_ can build it for you. Once you are done answering the questions, you can review all the information before sending your PR. Once you confirm each piece of information is accurate, _bbpr_ sends the pull request and redirects you to BitBucket if it is successful. If not, you will receive information about why it failed, and you'll be able to adjust. It's that simple.  
 
<h1 id="installation">Installation</h1>
<h3>Step 1: Prerequisites</h3> 
  
First, make sure you have the following installed on your computer: <a href="https://nodejs.org/en/">node.js</a>, <a href="https://www.npmjs.com/">npm</a>, and <a href="https://git-scm.com/">git</a> or <a href="https://www.mercurial-scm.org/">mercurial</a> depending on which version control system your team is using.   


<h3>Step 2: Npm Install</h3>
  
The very best way to use the latest version of _bbpr_ is to install it globally on your computer:
```  
npm install -g bbpr
```     

Congratulations, _bbpr_ is now installed properly and you can instantly use the `bbpr` terminal command from any local Mercurial repository linked to a remote BitBucket repository. However, a more useful way to use _bbpr_ is to configure it to your personal profile and taste.

<h1 id="Configuration">Use and Configuration</h1>  

_bbpr_ comes bundled with a global configuration file (`bbpr.config.js`) by default. That being said, it is recommended that you enter some information in it so it becomes faster to build your pull requests by being prompted with less questions to answer. You can edit your global _bbpr_ configuration file  (`bbpr.config.js`) any time with the following bbpr command options: 
  
`bbpr --cg` - opens your global configuration file so you can edit it manually.  
  
`bbpr --cg reset` - resets your global configuration file to the default configuration file.  

`bbpr --cg allTrue` - fill your global configuration file with valid and positive values for each config property.  
  
`bbpr --cg <path to a local config js file>` - replaces your current global config file with the local config file specified.  
  
`bbpr --cg <path to a remote (http/https) config js file>` - replaces your current global config file with the remote config file specified.  
  
`bbpr --init` - initialize a bbpr.config.js file in your local directory.  
 
`bbpr --cl` - opens your local configuration file so you can edit it manually.  
   
`bbpr --cl reset` - resets your local configuration file to the default configuration file.  

`bbpr --cl allTrue` - fill your local configuration file with valid and positive values for each config property.  
  
`bbpr --cl <path to a local config js file>` - replaces your current local config file with the local config file specified.  
  
`bbpr --cl <path to a remote (http/https) config js file>` - replaces your current local config file with the remote config file specified. 

__bbpr now also supports local configuration for each of your bitbucket repositories. To use this feature, simply add a valid bbpr.config.js configuration file at the root level of your repository.__  
  
Default configuration file overview:  

```javascript 
module.exports = {
  user: {
    password: null, // null or String.
        // If null and cachePwd is set to true, this property will be set to the (encrypted) password you entered via the prompt for your next BBPR sessions.
        // If not null and cachePwd is set to true, it will use the encrypted password stored in this property.
        // In any other case, you will be prompted at each BBPR session to provide your BitBucket password.
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
      default: '' // String. Set to your main branch (ex: master or default), or the branch to which you are making PRs most often. Defaults to default for Mercurial and master for Git
    }
  },
  globalVars: {
    openFileCommand: '' // String. Your preferred terminal command to open your config file (javascript file). BBPR uses a default command according to your platform if empty.
  }
}
```  
Once you configured _bbpr_ to your taste, you are ready to go. You can run `bbpr` from any local repository for which you want to make a pull request, and a session will start.

That's it, may you and your teammates enjoy the _bbpr_ way of doing BitBucket pull requests!
  
<h1 id="contribute">How to contribute</h1>

Please do not hesitate to make any change at any time to _bbpr_ by submitting a pull request, an issue, or any suggestion for improvements you might have.  
  
  <h2 id="contribute-roadmap">Roadmap</h2>  
    
  - eliminate the need to provide organization name and username - __DONE__  
  - add local bbpr.config.js file initialization terminal option - __DONE__  
  - allow configuration file to be set from a remote or local file - __DONE__  
  - better error messages on failed pull request - __DONE__  
  - allow git repositories to be handled - __DONE__  
  - better commandline options for configuration (local and global) __DONE__
  - fix pre-install and post-install script to preserve global config file of users __DONE__
  - rethink demo link options   
  - improved readme with more information, code examples, and cross-platform compatibility  
  - allow users to have local bbpr.config.js file for their repositories - __DONE__ 
  - reduce shelljs and bash dependency for before module install and after module install __DONE__
  - eliminate bash dependency for password caching __DONE__
  - unit tests everything - __IN PROGRESS__
  - allow PR updates through bbpr more explicitly 
  - check if destination branch exists remotely before making pull request  
  - improve normalization of configuration file  
  - allow local and global password caching (only global supported currently)
    
<h1 id="maintainer">Maintainer</h1>
 
Michel Moreau - [michmoreau.l@gmail.com](mailto:michmoreau.l@gmail.com?Subject=bbpr%20Project) 
