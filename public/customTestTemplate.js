(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['customTest'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"custom-test-box\">\r\n    <h3 onclick=\"changeCustomTest(this)\" class=\"custom-test-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":2,"column":67},"end":{"line":2,"column":76}}}) : helper)))
    + "</h3>\r\n    <div class=\"custom-test-text\">\r\n        "
    + alias4(((helper = (helper = lookupProperty(helpers,"content") || (depth0 != null ? lookupProperty(depth0,"content") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data,"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":19}}}) : helper)))
    + "\r\n    </div>\r\n</div>";
},"useData":true});
})();