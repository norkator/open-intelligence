import os
from configparser import ConfigParser


def app_config(filename=os.getcwd() + '/config.ini', section='app'):
    parser = ConfigParser()
    parser.read(filename)
    config = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            config[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))
    return config


def camera_config(filename=os.getcwd() + '/config.ini', section='camera'):
    parser = ConfigParser()
    parser.read(filename)
    config = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            config[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))
    return config


def db_config(filename=os.getcwd() + '/config.ini', section='postgresql'):
    parser = ConfigParser()
    parser.read(filename)

    db = {}

    # Checks to see if section (postgresql) parser exists
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]

    # Returns an error if a parameter is called that is not listed in the initialization file
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return db


def open_alpr_config(filename=os.getcwd() + '/config.ini', section='openalpr'):
    parser = ConfigParser()
    parser.read(filename)
    config = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            config[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))
    return config