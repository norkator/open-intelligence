import psycopg2
from module import configparser

params = configparser.db_config()
connection = psycopg2.connect(**params)
# print(connection.get_backend_pid())


def insert_value(label, file_name):
    cursor = connection.cursor()

    postgres_insert_query = """ INSERT INTO data (label, file_name) VALUES (%s,%s)"""
    record_to_insert = (label, file_name)
    cursor.execute(postgres_insert_query, record_to_insert)

    connection.commit()
    count = cursor.rowcount

    # print(count, "Database record inserted")
