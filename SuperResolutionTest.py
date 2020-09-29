import os
import sys
from argparse import ArgumentParser
from module import configparser
from objects import SrFile

super_resolution_config = configparser.any_config(filename=os.getcwd() + '/config.ini', section='super_resolution')
use_gpu = super_resolution_config['use_gpu'] == 'True'
if use_gpu is False:
    os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
    print('GPU Disabled at config')
from libraries.fast_srgan import infer_oi
from module import gpu_utils

# Parse arguments
parser = ArgumentParser()
parser.add_argument('--testfile', type=str,
                    help='Test mode loads image from project /images folder. Specify image name.')
args = parser.parse_args()

print('hello world')

# Check does system has GPU support
print('GPU support available: ' + str(gpu_utils.is_gpu_available()))

# Parse configs
app_config = configparser.any_config(filename=os.getcwd() + '/config.ini', section='app')
process_sleep_seconds = app_config['process_sleep_seconds']
max_width = int(super_resolution_config['max_width'])
max_height = int(super_resolution_config['max_height'])

if __name__ == '__main__':
    try:
        # Test mode
        sr_test_images = [SrFile.SrFile(
            None, None, None,
            os.getcwd() + '/images/' + args.testfile, os.getcwd() + '/images/' + 'sr_' + args.testfile, None, None)]
        infer_oi.process_super_resolution_images(
            sr_image_objects=sr_test_images,
            max_width=max_width,
            max_height=max_height
        )
    except KeyboardInterrupt:
        print >> sys.stderr, '\nExiting by user request.\n'
        sys.exit(0)

# ---------------------------------------------------------------------
