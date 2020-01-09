import psycopg2
from module import configparser

params = configparser.db_config()
connection = psycopg2.connect(**params)


# print(connection.get_backend_pid())


def insert_value(name, label, file_path, file_name, year, month, day, hour, minute, second):
    cursor = connection.cursor()

    # Datetime format: '2011-05-16 15:36:38'
    file_create_date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

    # print(file_create_date)

    # Query
    postgres_insert_query = """ INSERT INTO data (name, label, file_path, file_name, file_create_date) VALUES (%s,%s,%s,%s,%s)"""

    # Variables
    record_to_insert = (name, label, file_path, file_name, file_create_date)

    # Execute insert
    cursor.execute(postgres_insert_query, record_to_insert)

    connection.commit()
    count = cursor.rowcount

    # print(count, "Database record inserted")
