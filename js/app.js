(function(app, module, $) {
    module.options = {};

    module.status = {};

    module.actions = {
        look: function() {
            var text = "You're in a big, empty room, with white walls. ";
            text += module.getState('keys', 'inInventory') ? "" : "There's a set of keys here. ";
            text += module.getState('car', 'started') ? "There's a blue compact car not far from you; engine purring obediently. The sound of it echoes off the walls in this vast, empty space. " : "There's a blue compact car not far from you. It sits dormant. ";
            text += !module.getState('book', 'inInventory') ? "There's a worn book lying on the ground. " : "";

            return text;
        },

        inventory: function() {
            var text = "You are carrying: <br /> ";
            text += module.getState('keys', 'inInventory') ? "A set of keys. <br />" : "";
            text += module.getState('book', 'inInventory') ? "A worn book. <br />" : "";

            return text;
        },

        unknown: function() {
            return "You can't do that.";
        }
    };

    module.objects = {
        book: {
            properties: {
                name: 'book',
                collectable: true
            },
            
            state: {
                inInventory: false,
                read: false
            },

            get: function(tokens) {
                if (module.getState('book', 'inInventory')) {
                    var text = "You already have the book!";
                } else {
                    var text = "You pick up the book.";
                    module.setState('book', 'inInventory', true);
                }

                return text;
            },

            drop: function(tokens) {
                if (module.getState('book', 'inInventory')) {
                    var text = "You drop the book. It hits the ground with a thud and a cloud of dust flies up around it.";
                    module.setState('book', 'inInventory', false);
                } else {
                    var text = "You aren't carrying the book.";
                }

                return text;
            },

            read: function(tokens) {
                if (module.getState('book', 'inInventory')) {
                    module.setState('book', 'read', true);

                    return "Ah, yes. The owner's manual for your Fiesta. You haven't read this in awhile, and apparently had forgotten how to drive. No matter - it's all coming back to you, now.";
                } else {
                    return "You should probably pick up the book first.";
                }
            },

            examine: function(tokens) {
                return "This book looks fairly heavy for its size. It appears to have many pages. The pages are worn, but the writing is still legible.";
            }
        },

        keys: {
            properties: {
                name: 'keys',
                collectable: true
            },
            
            state: {
                inInventory: false,
                inserted: false
            },
            
            examine: function(tokens) {
                return "The keys are fairly standard in size and shape. There's a nondescript keyring with a few silver, metal keys hanging off of it. There's a tag on the keyring that says, 'Avery's Keys'. Considering that you're Avery, it appears that these keys are your own.";
            },

            insert: function(tokens) {
                if (!module.getState('keys', 'inInventory')) {
                    var text = "You don't have the keys on you in the first place!";
                } else {
                    if (module.getState('keys', 'inserted')) {
                        var text = "The keys are already inserted! They can't be inserted any further (you've tried).";
                    } else {
                        var text = "You insert the keys into the ignition. They slide in effortlessly and provide a satisfying 'click' when inserted fully.";
                        module.setState('keys', 'inserted', true);
                        module.setState('keys', 'inInventory', false);
                    }                    
                }

                return text;
            },

            remove: function(tokens) {
                if (!module.getState('keys', 'inserted')) {
                    var text = "The keys aren't in the ignition.";
                } else {
                    if (module.getState('car', 'started')) {
                        var text = "You're going to have to stop the car before removing the keys. Don't you know how to operate a car?";
                    } else {
                        var text = "You remove the keys from the ignition and put them in your pocket.";
                        module.setState('keys', 'inserted', false);
                        module.setState('keys', 'inInventory', false);
                    }
                }

                return text;
            },

            get: function(tokens) {
                if (module.getState('keys', 'inInventory')) {
                    var text = "You already have the keys!";
                } else {
                    if (module.getState('keys', 'inserted')) {
                        var text = "The keys are inserted into the ignition of the car. You're going to have to get them out first.";
                    } else {
                        var text = "You put the keys into your pocket.";
                        module.setState('keys', 'inInventory', true);
                    }
                }

                return text;
            },

            drop: function(tokens) {
                if (module.getState('keys', 'inInventory')) {
                    var text = "You drop the keys. They jingle loudly as they hit the ground. Do you always leave such a mess?";
                    module.setState('keys', 'inInventory', false);
                } else {
                    var text = "You aren't carrying the keys.";
                }

                return text;
            }
        },

        car: {
            properties: {
                name: 'car',
                collectable: false
            },
            state: {
                started: false
            },

            examine: function(tokens) {
                var text = "The car is compact and blue. You aren't sure of the model, ";
                text += module.getState('car', 'started') ? "but it seems to be running. " : "but you're pretty certain it would run if you tried to start it. ";
                text += module.getState('keys', 'inserted') ? "The keys are in the ignition. " : "";

                return text;
            },

            start: function(tokens) {
                if (module.getState('car', 'started')) {
                    var text = "The car is already started!";
                } else {
                    if (module.getState('keys', 'inserted')) {
                        var text = "You start the car. The engine roars to life, satisfyingly.";
                        module.setState('car', 'started', true);
                    } else {
                        var text = "You'll need to insert some keys if you'd like the car to start.";
                    }
                }

                return text;
            },

            stop: function(tokens) {
                if (!module.getState('car', 'started')) {
                    var text = "The car isn't running!";
                } else {
                    var text = "You stop the car. The previously lively engine dies down; the room becomes quiet.";

                    module.setState('car', 'started', false);
                }

                return text;
            },

            drive: function(tokens) {
                if (module.getState('book', 'read')) {
                    var text = "You press in the clutch, put the car into gear, and start driving away. Impulsively, you turn on the stereo, and eclectic electronic music begins playing. You keep driving for what seems like hours. Where does this white room end, anyway?<br />You wake up. Oh.";
                    module.elements.$playerInput.fadeOut();
                } else {
                    var text = "You... suddenly realize that you don't remember how to drive this thing. It's a manual. Who drives a manual? Manual... hm...";
                }

                return text;
            }
        },

        unknown: {
            unknown: true,
            all: function(tokens) {
                return "I don't know what that object is.";
            }
        }
    };

    module.player = {
        name: 'Avery'
    };
    
    module.init = function() {
        module.cacheElements();
        module.bindPlayerInput();
    };

    module.cacheElements = function() {
        module.elements = {};

        module.elements.$playerInput = $('#player-input');
        module.elements.$output = $('#output');
        module.elements.$outputBlockTemplate = $('.template .outputBlock');
    }

    module.bindPlayerInput = function() {
        module.elements.$playerInput.on('keypress', module.playerInputKeyHandler);
        module.elements.$playerInput.on('keyup', module.playerInputKeyupHandler);
    };

    module.playerInputKeyHandler = function(e) {
        module.status.lastKey = String.fromCharCode(e.which);
    };

    module.playerInputKeyupHandler = function(e) {
        module.status.lastVal = $(this).val();

        if (e.which == $.ui.keyCode.ENTER) {
            module.performAction();
            $(this).val('');
            module.status.lastVal = '';
            module.status.lastKey = '';
        }
    };

    module.playerInputSubmitHandler = function(e) {
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

        if (!tokens[1]) {
            // no subject
            if (module.actions[verb]) {
                // the verb is still valid, so let's execute that
                var text = module.actions[verb](tokens);
            } else {
                var text = module.actions.unknown(tokens);
            }
        } else {
            var subject = module.getObjFromName(tokens[1]);
            if (typeof subject[verb] == 'function') {
                var text = subject[verb](tokens);
            } else if (typeof subject.all == 'function') {
                // subject has an 'all' action so we can fall back to that
                var text = subject.all(tokens);
            } else {
                var text = module.actions.unknown(tokens);
            }
        }

        module.output(text);
    };

    module.getObjFromName = function(name) {
        if (module.objects[name]) {
            return module.objects[name];
        } else {
            return module.objects.unknown;
        }
    };

    module.getState = function(objName, property) {
        var obj = module.getObjFromName(objName);
        if (!obj.unknown) {
            var value = obj.state[property] || false;
        } else {
            var value = false;
        }
        
        return value;
    };

    module.setState = function(objName, property, value) {
        var obj = module.getObjFromName(objName);
        if (!obj.unknown) {
            obj.state[property] = value;

            return obj.state[property];
        } else {
            return false;
        }
    };

    module.output = function(output) {
        var $outputBlock = module.elements.$outputBlockTemplate.clone();

        $outputBlock.html(output);

        module.elements.$output.prepend($outputBlock);
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