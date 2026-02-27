Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\Users\smcg\artsync\artsync\tab-icon.png"
$destPath = "c:\Users\smcg\artsync\artsync\tab-icon-large.png"

try {
    $bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)
    
    $width = $bmp.Width
    $height = $bmp.Height
    
    $minX = $width
    $minY = $height
    $maxX = 0
    $maxY = 0
    
    # Calculate bounding box (non-transparent pixels)
    for ($x = 0; $x -lt $width; $x++) {
        for ($y = 0; $y -lt $height; $y++) {
            $pixel = $bmp.GetPixel($x, $y)
            if ($pixel.A -gt 0) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    
    if ($maxX -lt $minX) {
        Write-Host "Image is fully transparent."
        exit
    }
    
    $rect = New-Object System.Drawing.Rectangle($minX, $minY, ($maxX - $minX + 1), ($maxY - $minY + 1))
    $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
    
    # Square the image
    $maxDim = [Math]::Max($cropped.Width, $cropped.Height)
    $squareBmp = New-Object System.Drawing.Bitmap($maxDim, $maxDim)
    $g = [System.Drawing.Graphics]::FromImage($squareBmp)
    
    $centerX = ($maxDim - $cropped.Width) / 2
    $centerY = ($maxDim - $cropped.Height) / 2
    
    $g.DrawImage($cropped, $centerX, $centerY, $cropped.Width, $cropped.Height)
    
    $squareBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $squareBmp.Dispose()
    $cropped.Dispose()
    $bmp.Dispose()
    
    Write-Host "Successfully cropped image to $destPath"

} catch {
    Write-Host "Error: $_"
    exit 1
}
