(function(app, module, $) {
    module.options = {};

    module.status = {};

    module.actions = {
        examine: function(tokens) {
            var obj = module.getObjFromName(tokens[0]);

            module.output(module.performActionOnObject(obj, 'examine', tokens.slice(1)));            
        },

        unknown: function() {
            module.output("The command you have entered is unknown.");
        }
    };

    module.keywords = {
        'examine': module.actions.examine
    };

    module.objects = {
        book: {
            examine: function(tokens) {
                return "This book looks very heavy. It appears to have many pages. The pages are worn, but the writing is still legible.";
            }
        },

        unknown: {
            all: function(tokens) {
                return "I don't know what that object is.";
            }
        }
    };

    module.player = {
        name: 'Avery',
        score: 0
    };
    
    module.init = function() {
        module.cacheElements();
        module.bindPlayerInput();
    };

    module.cacheElements = function() {
        module.elements = {};

        module.elements.$playerInput = $('#player-input');
    }

    module.bindPlayerInput = function() {
        module.elements.$playerInput.on('keypress', module.playerInputKeyHandler);
        module.elements.$playerInput.on('keyup', module.playerInputKeyupHandler);
        module.elements.$playerInput.on('change', module.playerInputChangeHandler);
    };

    module.playerInputKeyHandler = function(e) {
        module.status.lastKey = String.fromCharCode(e.which);
    };

    module.playerInputKeyupHandler = function(e) {
        module.status.lastVal = $(this).val();
    };

    module.playerInputChangeHandler = function(e) {
        module.getTokens();

        module.performAction();
    };

    module.getTokens = function() {
        var tokens = module.status.lastVal.split(' ');

        module.status.lastTokens = tokens;

        return tokens;
    };

    module.performAction = function() {
        var tokens = module.getTokens();
        var verb = tokens[0];

        if (module.actions[verb]) {
            module.actions[verb](tokens.slice(1));
        } else {
            module.actions.unknown(tokens);
        }
    };

    module.getObjFromName = function(name) {
        if (module.objects[name]) {
            return module.objects[name];
        } else {
            return module.objects.unknown;
        }
    };

    module.performActionOnObject = function(obj, action, tokens) {
        if (obj.all) {
            return obj.all(tokens);
        } else if (obj[action]) {
            return obj[action](tokens);
        } else {
            return module.actions.unknown(tokens);
        }
    };

    module.output = function(output) {
        console.log(output);
    };

    $(document).ready(function() {
        // Initialize all modules
        for (var i in app.modules) {
            var mod = app.modules[i];
            if (mod.init) {
                mod.init();
            }
        }
    });
})(window.app = window.app || {
    modules: {}
}, window.app.modules.common = window.app.modules.common || {}, jQuery);