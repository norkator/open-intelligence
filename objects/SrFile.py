class SrFile(object):

    # Class constructor
    def __init__(self, id, label, image_name, input_image, output_image, detection_result):
        self.id = id
        self.label = label
        self.image_name = image_name
        self.input_image = input_image
        self.output_image = output_image
        self.detection_result = detection_result
        self.sr_image_data = None

    def set_sr_image_data(self, sr_data):
        self.sr_image_data = sr_data
