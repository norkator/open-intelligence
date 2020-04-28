from module import database
from objects import Instance
import sys
import os

instance = Instance.Instance(None, None)


def get_process_name():
    return os.path.basename(sys.argv[0])


def set_instance_status():
    # Clean ghost instances
    database.clean_instances()

    # No instance, create new
    if instance.id is None:
        process_name = get_process_name()
        instance.id = database.new_instance(process_name)
        instance.name = process_name
        print('[INFO] new instance id ' + str(instance.id))
    # Keep it updated
    elif instance.id is not None:
        database.update_instance(instance.id)
