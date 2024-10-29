# type: ignore


import json
import random

import idx2numpy


def load_idx_data(image_path, label_path):
    images = idx2numpy.convert_from_file(image_path)
    labels = idx2numpy.convert_from_file(label_path)
    return images, labels

def create_digit_map(images, labels, examples_per_digit=30):
    digit_map = {str(i): [] for i in range(10)}

    for digit in range(10):
        # Find all indices of the current digit
        digit_indices = [i for i, label in enumerate(labels) if label == digit]
        
        # Select a random sample of 30 examples for the current digit
        selected_indices = random.sample(digit_indices, examples_per_digit)
        digit_images = [images[i].tolist() for i in selected_indices]
        digit_map[str(digit)] = digit_images

    return digit_map

def save_to_json(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f)

if __name__ == "__main__":
    images, labels = load_idx_data('mnist/train-images.idx3-ubyte', 'mnist/train-labels.idx1-ubyte')
    digit_map = create_digit_map(images, labels, examples_per_digit=30)
    save_to_json(digit_map, 'mnist/mnist_subset.json')
