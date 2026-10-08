Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap 512, 512
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Background squircle
$rect = New-Object System.Drawing.Rectangle 16, 16, 480, 480
$pt1 = New-Object System.Drawing.Point 0, 512
$pt2 = New-Object System.Drawing.Point 512, 0
$c1 = [System.Drawing.ColorTranslator]::FromHtml('#10b981')
$c2 = [System.Drawing.ColorTranslator]::FromHtml('#06b6d4')
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $pt1, $pt2, $c1, $c2

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$radius = 120
$dia = $radius * 2
$path.AddArc($rect.X, $rect.Y, $dia, $dia, 180, 90)
$path.AddArc($rect.Right - $dia, $rect.Y, $dia, $dia, 270, 90)
$path.AddArc($rect.Right - $dia, $rect.Bottom - $dia, $dia, $dia, 0, 90)
$path.AddArc($rect.X, $rect.Bottom - $dia, $dia, $dia, 90, 90)
$path.CloseFigure()
$g.FillPath($brush, $path)

# Stroke pen for wallet
$strokeColor = [System.Drawing.ColorTranslator]::FromHtml('#090d16')
$pen = New-Object System.Drawing.Pen $strokeColor, 26
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

# Top wallet edge
$topPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$topPath.AddLine(175, 192, 175, 172)
$topPath.AddArc(175, 142, 60, 60, 180, 90)
$topPath.AddLine(205, 142, 307, 142)
$topPath.AddArc(277, 142, 60, 60, 270, 90)
$topPath.AddLine(337, 172, 337, 192)
$g.DrawPath($pen, $topPath)

# Main wallet body
$wRect = New-Object System.Drawing.Rectangle 152, 192, 208, 164
$wPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$wr = 28
$wd = $wr * 2
$wPath.AddArc($wRect.X, $wRect.Y, $wd, $wd, 180, 90)
$wPath.AddArc($wRect.Right - $wd, $wRect.Y, $wd, $wd, 270, 90)
$wPath.AddArc($wRect.Right - $wd, $wRect.Bottom - $wd, $wd, $wd, 0, 90)
$wPath.AddArc($wRect.X, $wRect.Bottom - $wd, $wd, $wd, 90, 90)
$wPath.CloseFigure()
$g.DrawPath($pen, $wPath)

# Clasp
$claspBrush = New-Object System.Drawing.SolidBrush $strokeColor
$cRect = New-Object System.Drawing.Rectangle 300, 252, 64, 48
$cPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$cr = 20
$cd = $cr * 2
$cPath.AddArc($cRect.X, $cRect.Y, $cd, $cd, 180, 90)
$cPath.AddArc($cRect.Right - $cd, $cRect.Y, $cd, $cd, 270, 90)
$cPath.AddArc($cRect.Right - $cd, $cRect.Bottom - $cd, $cd, $cd, 0, 90)
$cPath.AddArc($cRect.X, $cRect.Bottom - $cd, $cd, $cd, 90, 90)
$cPath.CloseFigure()
$g.FillPath($claspBrush, $cPath)

# Dot in clasp
$dotBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#10b981'))
$g.FillEllipse($dotBrush, 338, 268, 16, 16)

# Save files
$bmp.Save('public\logo.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('public\favicon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('app\icon.png', [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$g.Dispose()
Write-Output "Vector PNG generated successfully."
