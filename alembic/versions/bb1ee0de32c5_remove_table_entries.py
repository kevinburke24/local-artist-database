"""remove table entries

Revision ID: bb1ee0de32c5
Revises: db473e8bbba8
Create Date: 2026-05-31 16:49:15.382037

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy import delete

# revision identifiers, used by Alembic.
revision: str = 'bb1ee0de32c5'
down_revision: Union[str, Sequence[str], None] = 'db473e8bbba8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("DELETE FROM artists")
    op.execute("DELETE FROM artist_submissions")
    # ### end Alembic commands ###

def downgrade() -> None:
    """Downgrade schema."""
    
    # ### end Alembic commands ###
