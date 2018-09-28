// file source_UI/code_snippets.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------

define([
    'jquery',
    'base/js/namespace',
    'base/js/utils',
    'services/config',
    'base/js/keyboard',
    'base/js/dialog',
    './content_access'
], function ($, Jupyter, utils, configmod, keyboard, dialog, content_access) {
    "use strict";

    //todo: zrobić odtwarzanie pliku code_snippets.json po usunięciu przez użytkownika
    // create config object to load parameters
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});
    //var snippets_url = require.toUrl('./code_snippets.json'); //katalog w ktorym jest nasz extension
    var CODE_SNIPPETS_PATH_HIDDEN = '.jupytepide/conf/gui/code_snippets.json';
    var CODE_SNIPPETS_FN = 'code_snippets.json';
    var CODE_SNIPPETS_PATH = 'tree'; //'tree/.jupytepide/conf/gui';
    var parent = utils.url_path_split(Jupyter.notebook.notebook_path)[0];
//    var snippets_url = utils.url_path_join(
//        Jupyter.notebook.base_url, 'tree',
//        utils.encode_uri_components(parent), CODE_SNIPPETS_FN); //katalog domowy

    var snippets_url = utils.url_path_join(
        Jupyter.notebook.base_url, CODE_SNIPPETS_PATH, CODE_SNIPPETS_FN); //katalog domowy


    //alert(snippets_url);
    ///tree/code_snippets.json

    //alert(contents.api_url('code_snippets.json'));
    //snippets_url = contents.api_url('code_snippets.json');

    //alert(snippets_url);
    ///api/contents/code_snippets.json

    function getBaseUrl(){
        return base_url;
    }
    function getSnippetsUrl(){
        return snippets_url;
    }
    //combobox do ładowania snippetów - nie używany, można dostosować, nie usuwać na razie
    // config.loaded.then(function () {
    //     var dropdown = $("<select></select>").attr("id", "snippet_picker")
    //         .css("margin-left", "0.75em")
    //         .attr("class", "form-control select-xs")
    //         .change(insert_cell);
    //     Jupyter.toolbar.element.append(dropdown);
    // });

    // will be called when the nbextension is loaded
    function load_extension() {
        config.load(); // trigger loading config parameters

        //katalog z plikami json
        //var cfgPath = utils.url_path_join(Jupyter.notebook.base_url, 'tree/cfg');
        //konkretny plik json
        //var jsonFileName = "/code_snippets.json";

        //Ładowanie do comboboxa na pasku - można dostosować, nie usuwać na razie
        // $.getJSON(snippets_url, function (data) {
        //     // Add the header as the top option, does nothing on click
        //     var option = $("<option></option>")
        //         .attr("id", "snippet_header")
        //         .text("Snippets");
        //     $("select#snippet_picker").append(option);
        //
        //     // Add options for each code snippet in the snippets.json file
        //     $.each(data['code_snippets'], function (key, snippet) {
        //         var option = $("<option></option>")
        //             .attr("value", snippet['name'])
        //             .text(snippet['name'])
        //             .attr("code", snippet['code'].join('\n'));
        //         $("select#snippet_picker").append(option);
        //     });
        // })
        //     .error(function (jqXHR, textStatus, errorThrown) {
        //         // Add an error message if the JSON fails to load
        //         var option = $("<option></option>")
        //             .attr("value", 'ERROR')
        //             .text('Error: failed to load snippets!')
        //             .attr("code", "");
        //         $("select#snippet_picker").append(option);
        //     });

    }


    //***
    //nieuzywane
    function insert_cell() {
        var selected_snippet = $("select#snippet_picker").find(":selected");

        if (selected_snippet.attr("name") != 'header') {
            var code = selected_snippet.attr("code");
            var new_cell = Jupyter.notebook.insert_cell_above('code');
            new_cell.set_text(code);
            new_cell.focus_cell();

            $("option#snippet_header").prop("selected", true);
        }
    }
    //*** czytanie z pliku JSON po podanej nazwie snippeta
    //wstwianie celki o podanej nazwie
    function insert_cell1(name) {
        //handle function passed IN parameter
        var snippet_name = name.data.snippet_name;

        //czytanie jsona "/nbextensions/jupytepide/code_snippets.json"

        // $.getJSON(snippets_url, function (data) {
        //     // Insert snippet from JSON file named "snippet_name"
        //     $.each(data['code_snippets'], function (key, snippet) {
        //         if (snippet['name'] == snippet_name) {
        //             var new_cell = Jupyter.notebook.insert_cell_above('');
        //             new_cell.set_text(snippet['code'].join('\n'));
        //             new_cell.code_mirror.setOption('theme', 'mbo');
        //             new_cell.focus_cell();
        //
        //         };
        //
        //     });
        // });

        var snippets_data = content_access.readFile(CODE_SNIPPETS_PATH_HIDDEN);
        $.each(snippets_data['code_snippets'],function(key,snippet){
            if (snippet['name'] == snippet_name) {
                var new_cell = Jupyter.notebook.insert_cell_above('');
                new_cell.set_text(snippet['code'].join('\n'));
                new_cell.code_mirror.setOption('theme', 'mbo');
                new_cell.focus_cell();

            }
        });
    }
    //*** zapis dowolnego tekstu jako snippeta **
    function save_asSnippet(text){

    }
    //*** daje listę nazw snippetów z pliku JSON
    //nieuzywane, stara wersja
    function get_SnippetsList() {
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
        // (w tym przypadku tablicy snippetNames)
        $.ajaxSetup({
            async: false
        });

        var snippetsNames = [];
        //czytanie jsona
        $.getJSON(snippets_url, function (data) {
            // Insert snippet from JSON file named "snippet_name"
            $.each(data['code_snippets'], function (key, snippet) {
                snippetsNames.push(snippet['name']);
                //snippetsNames.push([{name:'Example 1',link:'#',time:'yesterday',snippet_name:'Example1',on_click:insert_cell1}]);

            });
        });

        return snippetsNames;
    }
    //*** Druga wersja - daje listę nazw snippetów w grupach
    function get_SnippetsList1(){
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
        // (w tym przypadku tablicy snippetNames)
        $.ajaxSetup({
            async: false
        });
        var snippetsNames = [];
        var snippets_data;

        snippets_data = content_access.readFile(CODE_SNIPPETS_PATH_HIDDEN);
        $.each(snippets_data['code_snippets'],function(key,snippet){
            snippetsNames.push({group:snippet['group'],name:snippet['name']});
        });



        return snippetsNames;
    }
    //*** daje same grupy z obiektu "groups" JSON
    function get_SnippetsGroups(){
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
        // (w tym przypadku tablicy snippetNames)
        $.ajaxSetup({
            async: false
        });
        var snippetsGroups = {};
        //czytanie jsona

        var snippets_data;

        snippets_data = content_access.readFile(CODE_SNIPPETS_PATH_HIDDEN);
        if (snippets_data){
            snippetsGroups=snippets_data.groups;
        }
        else snippetsGroups = false;


        return snippetsGroups;


    }
    //*** get Web Map Browser
    // zwraca tekst snippeta Web Map Browser
    //Do wstawienia w ukrytej celce zawierającej Web Map Browser
    function get_WebMapBrowserText() {
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
        // (w tym przypadku tablicy snippetNames)
        $.ajaxSetup({
            async: false
        });

        var snippet_name = "Web Map Browser";
        var WMBText = "";
        //czytanie jsona
        $.getJSON(snippets_url, function (data) {
            $.each(data['code_snippets'], function (key, snippet) {
                if (snippet['name'] == snippet_name) {
                    WMBText = snippet['code'].join('\n');
                }
            });
        });
        //WMBText = "12+99";
        return WMBText;
    }
    //*** createSnippet ***
    //Creates snippet from selected cell, returns an object codeSnippet - ready to save in file/add to UI
    function createSnippet(group_id_,snippet_name_){
        var cells=Jupyter.notebook.get_selected_cells();
        var celJSON=cells[0].toJSON();
        var codeSnippet = {group:group_id_,name:snippet_name_,code:[celJSON.source]};
        return codeSnippet;
    }
    //*** addSnippetClick ***
    //onclick funcion for adding snippets
    function addSnippetClick(e){
        var codeSnippet = createSnippet(e.group_id,e.snippet_name);
        addSnippet(codeSnippet);
    }
    //todo: zabezpieczyć przed dodaniem snippeta do nieistniejącej grupy (numeru grupy) - niekoniecznie potrzebne, można to kontrolować z zewnątrz
    //*** addSnippet ***
    //Adds snippet to JSON file and to UI
    function addSnippet(codeSnippet){
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
        // (w tym przypadku tablicy snippetNames)
        $.ajaxSetup({
            async: false
        });

        var JSONdata = {};
        var toAdd = true;

        var snippets_data = content_access.readFile(CODE_SNIPPETS_PATH_HIDDEN);
        JSONdata = snippets_data;
        $.each(snippets_data['code_snippets'],function(key,snippet){
            if (snippet['name'] == codeSnippet.name) {
                alert('There is already a snippet with the name: "'+ codeSnippet.name +'". Please change.');
                toAdd = false;
            }
        });


        if (toAdd) {
            JSONdata.code_snippets.push(codeSnippet);
            content_access.saveFile(CODE_SNIPPETS_PATH_HIDDEN,JSONdata);
            addSnippetToUI(codeSnippet.group,codeSnippet.name);
            return JSONdata;
        }
        else return false;

    }
    //*** addSnippetToUI ***
    function addSnippetToUI(group_id,snippet_name){
        var id=group_id;
        var snippet_item = $('<div/>').addClass('menu_snippets_item');
        var delBtn = $('<button/>',{title:'Delete this snippet'}).addClass('btn btn-danger btn-xs pull-right');
        var codeSnippet={group:id,name:snippet_name};

        delBtn
            .append($('<i/>').addClass('fa fa-trash'))
            .bind('click',codeSnippet,showDeleteSnippetWindow); //todo:przypiąć funkcję otwierającą dialog

        snippet_item
            .append($('<a/>',{href:'#'})
            .html(snippet_name)
                .bind('click', {snippet_name: snippet_name}, insert_cell1))
            .append(delBtn) ;

        $('#'+id+'.menu_snippets_item_content').append(snippet_item);
    }
    //*** deleteSnippetFromUI
    //$( "#1.menu_snippets_item_content .menu_snippets_item" ).each(function(index){console.log($(this).text())})
    function deleteSnippetFromUI(group_id,snippet_name){
        $( '#'+group_id+'.menu_snippets_item_content .menu_snippets_item' ).each(
            function(index){
                if ($(this).text()==snippet_name){
                    $(this).remove();
                }
            });
    }
    //*** deleteSnippet ***
    //deletes snippet fom file and from UI
    function deleteSnippet(codeSnippet){
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
        // (w tym przypadku tablicy snippetNames)
        $.ajaxSetup({
            async: false
        });

        var JSONdata = {};
        var deleted = 0;
        var toDelete=[];
        var i;

        var snippets_data = content_access.readFile(CODE_SNIPPETS_PATH_HIDDEN);
        JSONdata = snippets_data;
        $.each(snippets_data['code_snippets'],function(key,snippet){
            if (snippet['name'] == codeSnippet.data.name && snippet['group'] == codeSnippet.data.group) {
                toDelete.push(snippet);
            }
        });


        //delete snippets from JSONdata
        for (i = 0; i < toDelete.length; i++){
            JSONdata.code_snippets.splice(JSONdata.code_snippets.indexOf(toDelete[i]),1);
            deleted=deleted+1;
        }
        //alert("Delete snippet: "+codeSnippet.data.name+'?')

        //save to file and UI
        if (deleted!=0){
            //JSONdata.code_snippets.push(codeSnippet);
            deleteSnippetFromUI(codeSnippet.data.group,codeSnippet.data.name);
            content_access.saveFile(CODE_SNIPPETS_PATH_HIDDEN,JSONdata);
            //addSnippetToUI(codeSnippet.group,codeSnippet.name);
            return JSONdata;
        }
        if (deleted==0) {
            alert('There is no snippet with the name: "'+ codeSnippet.data.name +'" in menu group number: '+codeSnippet.data.group);
            return false;
        }
        if (deleted==-1){
            return false;
        }
    }
    //*** getMaxGroupId ***
    //do usunięcia
    function getMaxGroupId(){
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
        // (w tym przypadku tablicy snippetNames)
        $.ajaxSetup({
            async: false
        });
        var gids = [];

        var snippets_data = content_access.readFile(CODE_SNIPPETS_PATH_HIDDEN);
        $.each(snippets_data['groups'],function(key,groups){
            gids.push(groups['group_id']);
        });


        return Math.max(...gids);
    }
    //*** showAddSnippetWindow ***
    //wyświetla okno definiowania i dodawania snippeta
    //element = {group_name:"group name", id:3}
    function showAddSnippetWindow(element){
        //***
        var options = {};
        var dialog_body = $('<div/>').append(
            $("<p/>").addClass("rename-message")
                .text('You are adding a new snippet into group: '+element.data.group_name+'. Enter the name of a new snippet below:')
        ).append(
            $("<br/>")
        ).append(
            $('<input/>').attr('type','text').attr('size','25').addClass('form-control')
                .val("")
        );
        var d = dialog.modal({
            title: "Create Snippet in "+element.data.group_name,//+' '+element.data.id,
            body: dialog_body,
            notebook: options.notebook,
            keyboard_manager: Jupyter.notebook.keyboard_manager,//jeżeli to jest nieprzypisane to nie da się nic wprowadzić z klawiatury
            default_button: "Cancel",
            buttons : {
                "Cancel": {},
                "Save": {
                    class: "btn-primary",
                    click: function () {
                        addSnippetClick({group_id:element.data.id,snippet_name:d.find('input[type="text"]').val()});

                        d.modal('hide');
                    }
                }
            },
            open : function () {
                /**
                 * Upon ENTER, click the OK button.
                 */
                //Jeżeli nie podany jest keyboard_manager powyżej, to trzeba każde pole edycyjne potraktować tak:
                //Jupyter.notebook.keyboard_manager.register_events(d.find('input[type="text"]'));

                d.find('input[type="text"]').keydown(function (event) {
                    if (event.which === keyboard.keycodes.enter) {
                        d.find('.btn-primary').first().click();
                        return false;
                    }
                });
                d.find('input[type="text"]').focus().select();
            }
        });
        //***
    }
    //*** showDeleteConfirmation ***
    //Confirmation of deletion snippet or group
    function showDeleteConfirmation(){
        //TODO: dokończyć
    }
    //*** showDeleteSnippetWindow ***
    //wyświetla okno dodawania grupy
    //element = {group_name:"group name", id:3}
    function showDeleteSnippetWindow(codeSnippet){
        //***
        var options = {};
        var dialog_body = $('<div/>').append(
            $("<p/>").addClass("rename-message")
                .text('Do you really want to delete snippet: '+codeSnippet.data.name+'?')
        );
        var d = dialog.modal({
            title: "Delete snippet confirmation",//+' '+element.data.id,
            body: dialog_body,
            notebook: options.notebook,
            keyboard_manager: Jupyter.notebook.keyboard_manager,//jeżeli to jest nieprzypisane to nie da się nic wprowadzić z klawiatury
            default_button: "Cancel",
            buttons : {
                "Cancel": {},
                "Delete": {
                    class: "btn-primary",
                    click: function () {
                        deleteSnippet(codeSnippet);
                        //addGroup({ group_name: d.find('input[type="text"]').val()});
                        //addSnippetClick({group_id:element.data.id,snippet_name:d.find('input[type="text"]').val()});

                        d.modal('hide');
                    }
                }
            },
            open : function () {
                /**
                 * Upon ENTER, click the OK button.
                 */
                //Jeżeli nie podany jest keyboard_manager powyżej, to trzeba każde pole edycyjne potraktować tak:
                //Jupyter.notebook.keyboard_manager.register_events(d.find('input[type="text"]'));

                d.find('input[type="text"]').keydown(function (event) {
                    if (event.which === keyboard.keycodes.enter) {
                        d.find('.btn-primary').first().click();
                        return false;
                    }
                });
                d.find('input[type="text"]').focus().select();
            }
        });
        //***
    }
    //*** showAddGroupWindow ***
    //wyświetla okno dodawania grupy
    //element = {group_name:"group name", id:3}
    function showAddGroupWindow(){
        //***
        var options = {};
        var dialog_body = $('<div/>').append(
            $("<p/>").addClass("rename-message")
                .text('Enter the name of the new group below:')
        ).append(
            $("<br/>")
        ).append(
            $('<input/>').attr('type','text').attr('size','25').addClass('form-control')
                .val("")
        );
        var d = dialog.modal({
            title: "Add New Group in Snippets Menu",//+' '+element.data.id,
            body: dialog_body,
            notebook: options.notebook,
            keyboard_manager: Jupyter.notebook.keyboard_manager,//jeżeli to jest nieprzypisane to nie da się nic wprowadzić z klawiatury
            default_button: "Cancel",
            buttons : {
                "Cancel": {},
                "Save": {
                    class: "btn-primary",
                    click: function () {
                        addGroup({ group_name: d.find('input[type="text"]').val()});
                        //addSnippetClick({group_id:element.data.id,snippet_name:d.find('input[type="text"]').val()});

                        d.modal('hide');
                    }
                }
            },
            open : function () {
                /**
                 * Upon ENTER, click the OK button.
                 */
                //Jeżeli nie podany jest keyboard_manager powyżej, to trzeba każde pole edycyjne potraktować tak:
                //Jupyter.notebook.keyboard_manager.register_events(d.find('input[type="text"]'));

                d.find('input[type="text"]').keydown(function (event) {
                    if (event.which === keyboard.keycodes.enter) {
                        d.find('.btn-primary').first().click();
                        return false;
                    }
                });
                d.find('input[type="text"]').focus().select();
            }
        });
        //***
    }
    //*** make_snippets_menu_group ***
    //Creates a menu group with header and empty content (empty snippets list)
    var make_snippets_menu_group = function(element){

        var delete_click = $('<a/>',{href:'#'}).html('delete').addClass('pull-right');
        var menu_snippets_item_header = $('<a/>',{href:'#',id:element.id}).html(element.group_name);//.append($('<br>'));
        var menu_snippets_item_content = $('<div/>',{id:element.id}).addClass('menu_snippets_item_content');
        var addBtn = $('<button/>',{title:'Create snippet from selected cell'}).addClass('btn btn-primary btn-xs pull-right');
        addBtn.append($('<i/>').addClass('fa fa-plus'));

        addBtn.bind('click', element, showAddSnippetWindow) ;

        //TODO: dodanie wyskakującego - popracować
        //addBtn.popover({title: "", content: "Provide a snipppet name: <br> <input type='text' id='snippet_input' class='form-control' '>", html: true, placement: "left"});
        //Jupyter.notebook.keyboard_manager.register_events($('#snippet_input'));

        //TODO: w tym miejscu powinno być otwierane okienko, w którym podam nazwę snippeta i zatwierdzę (i wtedy addSnippetClick)

        var delBtn = $('<button/>',{title:'Delete group menu'}).addClass('btn btn-danger btn-xs pull-right');
        delBtn
            .append($('<i/>').addClass('fa fa-minus'))
            .bind('click',{group_id:element.id,group_name:element.group_name},deleteGroup);

        menu_snippets_item_header.click(function(){
            menu_snippets_item_content.slideToggle();
        });
        menu_snippets_item_header = $('<div/>',{id:element.id})
            .append(menu_snippets_item_header)
            .append(delBtn)
            .addClass('menu_snippets_item_header')
            .append(addBtn).append($('<br/>'));

        var item = {header:menu_snippets_item_header,content:menu_snippets_item_content};

        menu_snippets_item_content.hide();
        return item;
    };

    //***
    //todo: stworzyć funkcję produkującą pozycję menu snippet item - patrz panel browser. Użyć jej także do dodawania nowego snippeta
    //todo: zrobić usuwanie snippetów i grup
    //todo: zrobić tworzenie snippetów z celki

    //*** addGroupToUI ***
    function addGroupToUI(gr_name,gr_id){
        var menu_snippets=$('.menu_snippets');
        var menu_item = make_snippets_menu_group({group_name:gr_name,id:gr_id});
        menu_snippets.append(menu_item.header).append(menu_item.content);
    }
    //*** addGroup ***
    //Adds menu snippets group to JSON file and to UI
    //{ group_id: 1, group_name: "OTB", group_level: 0 }
    function addGroup(group){
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
        // (w tym przypadku tablicy snippetNames)
        $.ajaxSetup({
            async: false
        });

        var JSONdata = {};
        var toAdd=true;
        var gids = [];
        var maxGid;

        var snippets_data = content_access.readFile(CODE_SNIPPETS_PATH_HIDDEN);
        JSONdata = snippets_data;
        $.each(snippets_data['groups'],function(key,groups){
            if (groups['group_name'] == group.group_name) {
                alert('There is already a group menu with the name: "'+ group.group_name +'". Please change.');
                toAdd = false;
            }
            gids.push(groups['group_id']);
        });


        if (toAdd) {
            //check max group ID, assign max+1 value to new group
            maxGid=Math.max(...gids)+1;
            group.group_id=maxGid;
            JSONdata.groups.push(group);
            //Save to JSON file
            content_access.saveFile(CODE_SNIPPETS_PATH_HIDDEN, JSONdata);
            addGroupToUI(group.group_name,group.group_id);
            return JSONdata;
        }
        else return false;
    }
    //*** deleteGroup ***
    //group={group_name:'name',group_id:2}
    function deleteGroup(group){
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
        // (w tym przypadku tablicy snippetNames)
        $.ajaxSetup({
            async: false
        });

        var JSONdata = {};
        var deleted = 0;
        var toDelete=[];
        var i;
        var containsSnippets = false;

        var snippets_data = content_access.readFile(CODE_SNIPPETS_PATH_HIDDEN);
        JSONdata = snippets_data;
        //check if a group contains any snippets
        if (containsSnippets==false) {
            $.each(snippets_data['code_snippets'], function (key, snippet) {
                if (snippet['group'] == group.data.group_id) {
                    containsSnippets = true;
                }
            });
        }
        if (containsSnippets==false){
            $.each(snippets_data['groups'], function (key, groups) {
                if (groups['group_name'] == group.data.group_name) {
                    toDelete.push(groups);
                }
            });
        }

        //delete groups from JSONdata
        for (i = 0; i < toDelete.length; i++){
            JSONdata.groups.splice(JSONdata.groups.indexOf(toDelete[i]),1);
            deleted=deleted+1;
        }
        //save to file and UI
        if (deleted!=0){
            //JSONdata.code_snippets.push(codeSnippet);
            deleteGroupFromUI(group.data.group_id);
            content_access.saveFile(CODE_SNIPPETS_PATH_HIDDEN,JSONdata);
            //addSnippetToUI(codeSnippet.group,codeSnippet.name);
            return JSONdata;
        }
        if (deleted==0 && !containsSnippets) {
            alert('There is no group with the name: "'+ group.data.group_name +'"');
            return false;
        }
        else if (deleted==0 && containsSnippets) {
            alert('This group contains snippets. Can not be deleted.');
            return false;
        }
    }
    function deleteGroupFromUI(group_id){
        $( '#'+group_id+'.menu_snippets_item_header' ).remove(); //stąd wziąć text() i mam nazwę
        $( '#'+group_id+'.menu_snippets_item_content' ).remove();
    }
    // return public methods
    return {
        load_ipython_extension: load_extension,
        insert_snippet_cell: insert_cell1,
        //getSnippetsList: get_SnippetsList,
        getSnippetsList1: get_SnippetsList1,
        getSnippetsGroups:get_SnippetsGroups,
        //getWebMapBrowserText: get_WebMapBrowserText,
        addSnippet:addSnippet,
        addGroup:addGroup,
        getBaseUrl:getBaseUrl, //do usunięcia
        getSnippetsUrl:getSnippetsUrl, //do usunięcia
        getMaxGroupId:getMaxGroupId, //do usuniecia
        make_snippets_menu_group:make_snippets_menu_group,
        deleteSnippet:deleteSnippet,
        deleteGroup:deleteGroup,
        addSnippetToUI:addSnippetToUI,
        addSnippetClick:addSnippetClick,
        showAddSnippetWindow:showAddSnippetWindow,
        showAddGroupWindow:showAddGroupWindow,
        deleteGroupFromUI:deleteGroupFromUI

    };
});