# File object is responsible for holding basic information of image files
class Plate(object):

    # Class constructor
    def __init__(self, plate, confidence):
        self.plate = plate
        self.confidence = confidence
