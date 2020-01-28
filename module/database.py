import psycopg2
from module import configparser

params = configparser.db_config()


# connection = psycopg2.connect(**params)
# print(connection.get_backend_pid())


def db_connected():
    connection = psycopg2.connect(**params)
    try:
        cur = connection.cursor()
        cur.execute('SELECT 1')
        cur.close()
        return True
    except psycopg2.OperationalError:
        return False
    finally:
        connection.close()


def insert_value(name, label, file_path, file_name, year, month, day, hour, minute, second, file_name_cropped,
                 detection_result):
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()

        # Datetime format: '2011-05-16 15:36:38'
        file_create_date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

        # print(file_create_date)

        # Query
        postgres_insert_query = """ INSERT INTO data (name, label, file_path, file_name, file_create_date, detection_completed, file_name_cropped, detection_result) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"""

        # Variables
        record_to_insert = (name, label, file_path, file_name, file_create_date, 1, file_name_cropped, detection_result)

        # Execute insert
        cursor.execute(postgres_insert_query, record_to_insert)

        connection.commit()
        count = cursor.rowcount

        cursor.close()
        # print(count, "Database record inserted")
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def get_super_resolution_images_to_compute():
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()
        sr_work_query = "SELECT id, label, file_name_cropped, detection_result FROM data WHERE sr_image_computed = 0 ORDER BY id ASC LIMIT 10"

        cursor.execute(sr_work_query)
        sr_work_records = cursor.fetchall()

        # for row in sr_work_records:
        #    print("Id = ", row[0], )
        #    print("Label = ", row[1])
        #    print("Cropped  = ", row[2])
        #    print("Detection result  = ", row[3], "\n")
        cursor.close()
        return sr_work_records
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def update_super_resolution_row_result(detection_result, sr_image_name, id):
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()

        sr_update_query = """UPDATE data SET sr_image_computed = 1, detection_after_sr_completed = 1, detection_result = %s, sr_image_name = %s WHERE id = %s"""
        cursor.execute(sr_update_query, (detection_result, sr_image_name, id))
        connection.commit()
        cursor.close()
        # count = cursor.rowcount
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def bool_run_train_face_model():
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()
        face_action_query = "SELECT id FROM apps WHERE action_name = 'train_face_model' AND action_completed = 0 LIMIT 1"
        cursor.execute(face_action_query)
        face_action_query_records = cursor.fetchall()

        bool_run_action = len(face_action_query_records) > 0

        if bool_run_action:
            face_action_update_query = """UPDATE apps SET action_completed = 1 WHERE action_name = 'train_face_model'"""
            cursor.execute(face_action_update_query)
            connection.commit()

        cursor.close()
        return bool_run_action
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
        return False
    finally:
        connection.close()
