import tensorflow as tf
 
# Check TensorFlow version
print("TensorFlow version:", tf.__version__)
 
# Check if TensorFlow can access GPU
print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))
 
# Simple computation
a = tf.constant([[1.0, 2.0], [3.0, 4.0]])
b = tf.constant([[1.0, 1.0], [0.0, 1.0]])
print("Running simple matrix operation on GPU")
c = tf.matmul(a, b)
print("Result of the matrix operation:", c)
