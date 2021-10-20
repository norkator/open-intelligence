module.exports = {
  apps: [{
    name: "api",
    script: "./intelligence.js",
    instances: 4,
  }, {
    name: "tasks",
    script: "./intelligence-tasks.js",
    instances: 1,
  }, {
    name: "front-end",
    script: "npm start --prefix ./front-end",
    instances: 1,
  }]
};
