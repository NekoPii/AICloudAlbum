from matplotlib import pyplot as plt


def VisualizeBlocks(filename, blocks):
    img = plt.imread(filename)
    fig = plt.figure()
    ax = fig.add_subplot(1, 1, 1)
    for block in blocks:
        top = block[0]
        right = block[1]
        bottom = block[2]
        left = block[3]
        start = (left, top)
        width = right-left
        height = bottom-top
        rect = plt.Rectangle(start, width, height, fill=False, edgecolor='red', linewidth=2)
        ax.add_patch(rect)
    plt.imshow(img)
    plt.show()
    # cv2.imwrite('new_test_3.jpg', img)
