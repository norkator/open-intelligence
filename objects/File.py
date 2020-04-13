class File(object):

    # Class constructor
    def __init__(self, name, file_path, file_name, file_extension, year, month, day, hours, minutes, seconds, getmtime):
        self.name = name  # Known as camera name
        self.file_path = file_path
        self.file_name = file_name
        self.file_extension = file_extension
        self.year = year
        self.month = month
        self.day = day
        self.hours = hours
        self.minutes = minutes
        self.seconds = seconds
        self.getmtime = getmtime
