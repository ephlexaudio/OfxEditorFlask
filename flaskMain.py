import os
import sys
import atexit
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, jsonify, Response
from webui import WebUI
import json
from werkzeug.datastructures import ImmutableMultiDict
import unicodedata
import time
import httplib
import array

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

component_path = BASE_DIR + '/OfxEditorFlask/Components'
combo_path = BASE_DIR + '/OfxEditorFlask/Combos'
app = Flask(__name__)

ui = WebUI(app, debug=False)
dbg = False

def exit_function():
    print "closing...."

def init_ui():
    # create our little application :)
    app.config.from_object(__name__)


    # Load default config and override config from an environment variable
    app.config.update(dict(
        DATABASE=None,
        SECRET_KEY='development key',
        USERNAME='admin',
        PASSWORD='default'
    ))
    app.config.from_envvar('FLASKR_SETTINGS', silent=True)
    return 0

def get_combo_list():
    combo_list_data = []

    files = os.listdir(combo_path)
    print files

    return files

def get_combo(combo_name):
    file_path_name = combo_path + '/' + combo_name + '.txt'
    if(dbg): print file_path_name
    comboFile = open(file_path_name,'r')
    if(dbg): print comboFile
    combo_data = comboFile.read()
    if(dbg): print combo_data
    comboFile.close()

    return combo_data

def save_combo(combo_name, combo_data_json):
    file_path_name = combo_path + '/' + combo_name + '.txt'
    if(dbg): print file_path_name
    comboFile = open(file_path_name,'w')

    comboFile.write(combo_data_json)
##    print combo_data_json
    comboFile.close()
    return get_combo_list()

def delete_combo(combo_name):
    file_path_name = combo_path + '/' + combo_name + '.txt'
    os.remove(file_path_name)
    return get_combo_list()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getComponents')
def getComponents():
    if(dbg): print "getting Components"
    component_data = []
    files = os.listdir(component_path)
    if(dbg): print files
    for file_path_name in files:
        file_path_name = component_path + '/' + file_path_name
        componentFile = open(file_path_name,'r')
        file_data = componentFile.read()
        component_data.append(file_data)
    return Response(json.dumps(component_data),  mimetype='application/json')

@app.route('/listCombos')
def listCombos():
    if(dbg): print "list Combos"

    combo_list = get_combo_list()
    if(dbg):  print "combo json:"
    combo_json = []
    for combo in combo_list:
        combo = combo.split('.')[0]
        combo_json.append({'name':combo})
    if(dbg): print combo_json
    return Response(json.dumps(combo_json),  mimetype='application/json')

@app.route('/getCombo/<combo_name>')
def getCombo(combo_name):
    if(dbg): print "get Combo"

    if(dbg): print combo_name
    command_string = combo_name.encode('ascii')
    if(dbg): print("command string: %s" % command_string)
    command_bytes = array.array('B',command_string)
    if(dbg): print command_bytes
    combo_data = get_combo(command_string)
    combo_data_ascii = combo_data.encode('ascii')
    combo_json = json.loads(combo_data_ascii)

    return jsonify(**combo_json)

@app.route('/deleteCombo/<combo_name>', methods=["DELETE"])
def deleteCombo(combo_name):

    if(dbg): print "delete Combo"
    command_string = combo_name.encode('ascii')
    if(dbg): print command_string
    command_bytes = array.array('B',command_string)
    if(dbg): print command_bytes

    delete_combo(command_string)
    combo_list = get_combo_list()
    if(dbg): print combo_list
    combo_json = []
    for combo in combo_list:
        combo = combo.split('.')[0]
        combo_json.append({'name':combo})
    return Response(json.dumps(combo_json),  mimetype='application/json')

@app.route('/saveCombo', methods=["POST"])
def saveCombo():

    if(dbg): print "save Combo"
    if(dbg): print "*****************************************************************"
    request.get_data()
    combo_json = {}
    if request.get_json():
        combo_json = request.get_json()
    else:
        print "converting string to JSON"
        combo_json = json.loads(request.data)
        if combo_json:
            pass
        else:
            print "NO JSON"
    try:
        combo_json_string = request.data.encode('ascii')
        print combo_json_string[0:1000]
        combo_name = combo_json["name"].encode('ascii')
        print combo_name[0:1000]
        combo_list = save_combo(combo_name, combo_json_string)
    except Exception as e:
        print("Error: %s" % e)

    if(dbg): print "Combo List:"
    if(dbg): print combo_list
    combo_json = []
    if len(combo_list) > 1:
        combo_list_data = combo_list

    else:
        combo_list_data = combo_list.split(',')
    for combo in combo_list_data:
        combo = combo.split('.')[0]
        combo_json.append({'name':combo})
    if(dbg): print "returning response for save combo: " + str(combo_json)
    return Response(json.dumps(combo_json),  mimetype='application/json')

@app.route('/getCurrentStatus')
def getCurrentStatus():
    combo_string = "Running";
    if(dbg): print("combo string: %s" % combo_string)
    combo_json = {"ofxMainStatus":combo_string}
    return Response(json.dumps(combo_json),  mimetype='application/json')

@app.route('/changeValue', methods=["POST"])
def changeValue():
    request.get_data()
    if(dbg): print "request.data"
    if(dbg): print request.data
    command = "changeValue:" + request.data
    if(dbg): print "command: " + command
    if(dbg): print combo_string
    return ('', httplib.NO_CONTENT)



if __name__ == '__main__':
    if init_ui() == 0:
        ui.run()
    atexit.register(exit_function())
