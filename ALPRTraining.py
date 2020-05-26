# '''
# Clean rejected images
from libraries.nitramite_alpr import clean

clean.app()
# '''

'''
# Import car images ready for labeling
from libraries.nitramite_alpr import importData

importData.app()
'''

'''
# Export, prepare images
from libraries.nitramite_alpr import export

export.app()
'''

'''
# Train
from libraries.nitramite_alpr import train

train.train()
'''

'''
# Test
from libraries.nitramite_alpr import test

test.test(None)
'''
