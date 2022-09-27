class TrainingFile(object):

    # Class constructor
    # noinspection PyShadowingBuiltins
    def __init__(self, id, file_name_cropped, label, labeling_image_x, labeling_image_y, labeling_image_x2,
                 labeling_image_y2, file_full_path):
        self.id = id
        self.file_name_cropped = file_name_cropped
        self.label = label
        self.labeling_image_x = labeling_image_x
        self.labeling_image_y = labeling_image_y
        self.labeling_image_x2 = labeling_image_x2
        self.labeling_image_y2 = labeling_image_y2
        self.file_full_path = file_full_path
