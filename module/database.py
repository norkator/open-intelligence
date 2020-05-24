import os
import psycopg2
from module import configparser
from argparse import ArgumentParser

# Process arguments
parser = ArgumentParser()
parser.add_argument('--bool_slave_node', type=str, help='Multi node support, give string True as input if slave.')
args = parser.parse_args()
if args.bool_slave_node == 'True':
    print('[INFO] Process running in slave mode!')

params = configparser.any_config(
    filename=os.getcwd() + ('/config_slave.ini' if args.bool_slave_node == 'True' else '/config.ini'),
    section='postgresql'
)


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
                 detection_result, color):
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()

        # Datetime format: '2011-05-16 15:36:38'
        file_create_date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

        # print(file_create_date)

        # Query
        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        postgres_insert_query = """ INSERT INTO data (name, label, file_path, file_name, file_create_date, detection_completed, file_name_cropped, detection_result, color) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"""

        # Variables
        record_to_insert = (
            name, label, file_path, file_name, file_create_date, 1, file_name_cropped, detection_result, color)

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
        # Load specific label image not older than one day from now
        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        sr_work_query = "SELECT id, label, file_name_cropped, detection_result FROM data WHERE file_create_date > now() - interval '1 day' AND (label = 'car' OR label = 'truck' OR label = 'bus') AND sr_image_computed = 0 ORDER BY id ASC LIMIT 10"

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


def update_super_resolution_row_result(detection_result, color, sr_image_name, id):
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()

        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        sr_update_query = """UPDATE data SET sr_image_computed = 1, detection_after_sr_completed = 1, detection_result = %s, color = %s, sr_image_name = %s WHERE id = %s"""
        cursor.execute(sr_update_query, (detection_result, color, sr_image_name, id))
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
        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        face_action_query = "SELECT id FROM apps WHERE action_name = 'train_face_model' AND action_completed = 0 LIMIT 1"
        cursor.execute(face_action_query)
        face_action_query_records = cursor.fetchall()

        bool_run_action = len(face_action_query_records) > 0

        if bool_run_action:
            # noinspection SqlDialectInspection,SqlNoDataSourceInspection
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


def get_detection_tasks():
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()
        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        detection_work_query = "SELECT id, label, file_name_cropped FROM data WHERE detection_completed = 0 AND detection_result IS NULL AND file_name_cropped IS NOT NULL ORDER BY id ASC LIMIT 10"

        cursor.execute(detection_work_query)
        detection_work_records = cursor.fetchall()

        cursor.close()
        return detection_work_records
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def update_detection_task_result(id, detection_result):
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()

        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        sr_update_query = """UPDATE data SET detection_completed = 1, detection_result = %s WHERE id = %s"""
        cursor.execute(sr_update_query, (detection_result, id))
        connection.commit()
        cursor.close()
        # count = cursor.rowcount
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def get_insight_face_images_to_compute():
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()
        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        sr_work_query = "SELECT id, label, file_name_cropped, detection_result FROM data WHERE label = 'person' AND insight_face_computed = 0 ORDER BY id ASC LIMIT 10"
        cursor.execute(sr_work_query)
        sr_work_records = cursor.fetchall()
        cursor.close()
        return sr_work_records
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def update_insight_face_as_computed(detection_result, id):
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()
        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        sr_update_query = """UPDATE data SET insight_face_computed = 1, detection_result = %s WHERE id = %s"""
        cursor.execute(sr_update_query, (detection_result, id))
        connection.commit()
        cursor.close()
        # count = cursor.rowcount
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def get_images_for_similarity_check_process():
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()

        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        query = """SELECT id, label, file_name_cropped, file_create_date
            FROM data
            WHERE /*file_create_date > DATE(now()) AND*/
              label in ('car', 'truck', 'bus') AND
              detection_result IS NULL AND similarity_checked = 0
              AND (detection_after_sr_completed = 1 OR file_create_date < DATE(now()) )
              AND extract(hour from file_create_date) = (
                SELECT distinct extract(hour from file_create_date)
                FROM data
                WHERE
                  /*file_create_date > DATE(now()) AND*/
                  label in ('car', 'truck', 'bus') AND
                  file_create_date < now() - interval '1 hour'
                  AND (detection_after_sr_completed = 1 OR file_create_date < DATE(now()) )
                  AND (detection_result IS NULL OR detection_result = ' ')
                  AND similarity_checked = 0
                LIMIT 1
              )
            ORDER BY id ASC;"""

        cursor.execute(query)
        records = cursor.fetchall()

        cursor.close()
        return records
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def update_similarity_check_row_checked(id):
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()
        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        update_query = """UPDATE data SET similarity_checked = 1 WHERE id = %s"""
        cursor.execute(update_query, (id,))
        connection.commit()
        cursor.close()
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def clean_instances():
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()
        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        cursor.execute("""DELETE FROM instances WHERE "updatedAt" < NOW() - interval '15 minutes'""")
        connection.commit()
        cursor.close()
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def new_instance(process_name):
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()

        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        postgres_insert_query = """ INSERT INTO instances (process_name) VALUES (%s) RETURNING id;"""

        # Execute insert
        cursor.execute(postgres_insert_query, (process_name,))
        inserted_id = cursor.fetchone()[0]
        connection.commit()
        cursor.close()

        return inserted_id
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
        return None
    finally:
        connection.close()


# noinspection PyShadowingBuiltins
def update_instance(id):
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()
        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        update_query = """UPDATE instances SET "updatedAt" = NOW() WHERE id = %s"""
        cursor.execute(update_query, (id,))
        connection.commit()
        cursor.close()
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def get_labeled_for_training_lp_images():
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()

        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        query = """SELECT id, label, file_name_cropped, labeling_image_x, labeling_image_y, labeling_image_x2, labeling_image_y2
            FROM data WHERE labeled_for_training = 1 and (label = 'car' OR label = 'truck' or label = 'bus')
            and labeling_image_x > 0
            ORDER BY id ASC;"""

        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        query2 = """SELECT id, NULL, file_name_cropped, labeling_image_x, labeling_image_y, labeling_image_x2, labeling_image_y2
            FROM offsites WHERE labeled_for_training = 1 and (label = 'car' OR label = 'truck' or label = 'bus')
            and labeling_image_x > 0
            ORDER BY id ASC;"""

        cursor.execute(query)
        records = cursor.fetchall()
        cursor.execute(query2)
        records2 = cursor.fetchall()
        concatenated_results = records + records2

        cursor.close()
        return concatenated_results
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
    finally:
        connection.close()


def insert_offsite_value(name, label, file_name, year, month, day, hour, minute, second, file_name_cropped):
    connection = psycopg2.connect(**params)
    try:
        cursor = connection.cursor()

        # Datetime format: '2011-05-16 15:36:38'
        file_create_date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

        # noinspection SqlDialectInspection,SqlNoDataSourceInspection
        postgres_insert_query = """
            INSERT INTO offsites (name, label, file_name, file_create_date, file_name_cropped) VALUES (%s,%s,%s,%s,%s) RETURNING id;
        """

        # Variables
        record_to_insert = (
            name, label, file_name, file_create_date, file_name_cropped)

        # Execute insert
        cursor.execute(postgres_insert_query, record_to_insert)

        inserted_id = cursor.fetchone()[0]
        connection.commit()
        cursor.close()

        return inserted_id
    except psycopg2.DatabaseError as error:
        connection.rollback()
        print(error)
        return None
    finally:
        connection.close()
